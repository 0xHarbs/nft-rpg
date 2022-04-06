// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/IFactionFactory.sol";
import "./interfaces/IFactionManager.sol";
import "./interfaces/IFactory.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract FactionManager {
    using Counters for Counters.Counter;
    Counters.Counter private depositCounter;
    Counters.Counter public raidCounter;
    Counters.Counter public conquerCounter;

    IFactionFactory factionFactory;
    IFactionManager manager;
    IFactory factory;

    // @dev Battle Types can be used to settle a conquer attempt
    // Default type is FULL ARMY effectively a vote based system using stats as weight
    enum BattleType {
        FULLARMY,
        BESTFIGHTER,
        TOURNAMENT
    }

    struct Army {
        uint256 factionId;
        uint256 members;
        uint256 reserves;
        uint256 payRate;
        uint256 armySlots;
        uint256 wageBonus;
        uint256 wageCooldown;
        address armyLeader;
        bool limit;
        bool leadershipBlock;
    }

    struct Raid {
        uint256 raidId;
        uint256 raidCooldown;
        uint256 raidBalance;
        uint256 attackerId;
        uint256 defenderId;
        uint256 attackerStats;
        uint256 defenderStats;
        bool active;
    }

    struct Conquer {
        uint256 conquerId;
        uint256 conquerCooldown;
        uint256 conquerBalance;
        uint256 attackerId;
        uint256 defenderId;
        uint256 attackerStats;
        uint256 defenderStats;
        bool active;
    }

    struct BattleManager {
        uint256 factionId;
        uint256 raidCooldown;
        uint256 raidDefenseCooldown;
        uint256 conquerCooldown;
        uint256 conquerDefenseCooldown;
        uint256 homeProvenancesConquered;
        bool raidActive;
        bool conquerActive;
        bool homeConquered;
    }

    // ================ MAPPINGS ==================== //
    mapping(uint256 => Army) public factionIdToArmy;
    mapping(address => bool) public armyGeneral;
    mapping(address => bool) public armyMember;
    mapping(address => uint256) public armyBalance;
    mapping(address => uint256) addressToWageCooldown;
    mapping(uint256 => bool) public depositCredit;
    mapping(uint256 => BattleManager) public factionIdToBattleManager;
    mapping(uint256 => Raid) public idToRaid;
    mapping(uint256 => Conquer) public idToConquer;
    mapping(address => bool) activeInBattle;
    mapping(uint256 => uint256) public factionIdToDefense;
    mapping(uint256 => uint256) public factionIdToAttack;

    constructor(
        address factionFactoryContract,
        address factionManagerContract,
        address factoryContract
    ) {
        factionFactory = IFactionFactory(factionFactoryContract);
        manager = IFactionManager(factionManagerContract);
        factory = IFactory(factoryContract);
    }

    // ================= FACTION LEADER FUNCTIONS ======================== //
    // @dev Allows the faction leader to create an army, assign a leader, and funds
    // @params _wageCooldown is input as a number of days
    function createArmy(
        uint256 _factionId,
        uint256 _reserves,
        uint256 _payRate,
        uint256 _armySlots,
        uint256 _wageBonus,
        uint256 _wageCooldown,
        address _address,
        bool _limit
    ) external {
        require(
            factionFactory.isLeader(_factionId, msg.sender),
            "Only leaders can create an army"
        );
        require(
            factionIdToArmy[_factionId].members == 0,
            "Army already exists"
        );
        require(
            factionFactory.getReserves(_factionId) > _reserves,
            "Not enough funds in reserves to make this payment"
        );
        factionFactory.assignReserves(_factionId, _reserves);
        Army storage army = factionIdToArmy[_factionId];
        army.factionId = _factionId;
        army.armyLeader = _address;
        army.reserves = _reserves;
        army.payRate = _payRate;
        army.wageCooldown = (86400 * _wageCooldown);
        army.members += 1;
        army.wageBonus = _wageBonus;
        armyMember[_address] = true;
        BattleManager storage battle = factionIdToBattleManager[_factionId];
        battle.factionId = _factionId;
        battle.conquerCooldown = block.timestamp;
        battle.raidCooldown = block.timestamp;
        if (_limit == true) {
            army.limit = true;
            army.armySlots = _armySlots;
        }
    }

    // @dev Allows leader to assign army leader if army leader has not blocked the change
    function assignArmyLeader(uint256 _factionId, address _address) external {
        require(
            factionFactory.isLeader(_factionId, msg.sender) ||
                factionIdToArmy[_factionId].armyLeader == msg.sender,
            "Only leaders or army leaders can assign army leaders"
        );
        require(
            !factionIdToArmy[_factionId].leadershipBlock,
            "The army leader has blocked leadership change"
        );
        factionIdToArmy[_factionId].armyLeader = _address;
        if (!factionFactory.isHead(_factionId, _address)) {
            factionFactory.flipHeadState(_factionId, _address);
        }
    }

    // // @dev Reserves can be given to the army from the leader and bonuses can change
    function changeArmyFunding(
        uint256 _factionId,
        uint256 _reservesToAdd,
        uint256 _wageBonus
    ) external {
        require(
            !manager.stateWithheld(_factionId),
            "Wage bonuses can't be changed in a leadership block"
        );
        require(
            factionFactory.isLeader(_factionId, msg.sender),
            "Only a leader can add reserves"
        );
        factionFactory.assignReserves(_factionId, _reservesToAdd);
        factionIdToArmy[_factionId].reserves += _reservesToAdd;
        factionIdToArmy[_factionId].wageBonus = _wageBonus;
    }

    // ================== ARMY HEAD FUNCTIONS ================ //
    function assignGeneral(address _address, uint256 _factionId) external {
        require(
            factionIdToArmy[_factionId].armyLeader == msg.sender,
            "Only army leaders can assign generals"
        );
        armyGeneral[_address] = true;
    }

    // @dev Raids can be initiated by generals on factions with less than 250 members
    // Reserves from both parties are sent to balance and the winner gets all
    // It's more lucrative to attack then defend
    // If a faction is already in battle their total power is reduced to 33%
    function raidFaction(uint256 _attackerId, uint256 _defenderId) external {
        require(
            factionIdToArmy[_attackerId].armyLeader == msg.sender ||
                armyGeneral[msg.sender],
            "Only army leaders or generals can action a raid"
        );
        uint256 factionMembers;
        (, , , , , , , factionMembers, ) = factionFactory.getFaction(
            _defenderId
        );
        require(
            factionMembers <= 250,
            "Factions with more than 250 members can not be raided"
        );
        require(
            factionIdToBattleManager[_attackerId].raidCooldown <
                block.timestamp,
            "Your raid cooldown is still in place"
        );
        require(
            factionIdToBattleManager[_attackerId].raidDefenseCooldown <
                block.timestamp,
            "This faction can not be raided until their cooldown expires"
        );
        raidCounter.increment();
        Raid storage raid = idToRaid[raidCounter.current()];
        factionIdToArmy[_attackerId].reserves -= (factionIdToArmy[_attackerId]
            .reserves / 25);
        factionIdToArmy[_defenderId].reserves -= (factionIdToArmy[_defenderId]
            .reserves / 13);
        raid.raidCooldown = block.timestamp + 86400;
        raid.raidBalance +=
            (factionIdToArmy[_defenderId].reserves / 13) +
            (factionIdToArmy[_attackerId].reserves / 25);
        if (
            factionIdToBattleManager[_attackerId].conquerActive ||
            factionIdToBattleManager[_attackerId].raidActive
        ) {
            raid.attackerStats += factionIdToAttack[_attackerId] / 3;
        } else {
            raid.attackerStats += factionIdToAttack[_attackerId];
            factionIdToBattleManager[_attackerId].raidActive = true;
        }
        raid.defenderStats += factionIdToDefense[_defenderId];
    }

    //@ dev Similar setup for raids but conquering costs more and earns more
    // If conquer is badly co-ordinated the defender can gain a lot
    // Defenders do not commit capital when being conquered given them a slight edge
    function conquerFaction(uint256 _attackerId, uint256 _defenderId) external {
        require(
            factionIdToArmy[_attackerId].armyLeader == msg.sender,
            "Only army leaders can action a loot"
        );
        require(
            factionIdToBattleManager[_attackerId].conquerCooldown <
                block.timestamp,
            "Your conquer cooldown is still in place"
        );
        conquerCounter.increment();
        Conquer storage conquer = idToConquer[conquerCounter.current()];
        uint256 conquerCost = (factionIdToArmy[_attackerId].reserves / 5);
        factionIdToArmy[_attackerId].reserves -= conquerCost;
        conquer.conquerCooldown = block.timestamp + (86400 * 3);
        conquer.conquerBalance += conquerCost;
        if (
            factionIdToBattleManager[_attackerId].conquerActive ||
            factionIdToBattleManager[_attackerId].raidActive
        ) {
            conquer.attackerStats += factionIdToAttack[_attackerId] / 3;
        } else {
            conquer.attackerStats += factionIdToAttack[_attackerId];
            factionIdToBattleManager[_attackerId].conquerActive = true;
        }
        conquer.defenderStats += factionIdToDefense[_defenderId];
    }

    // @dev Allows the head of a state under seige or conquerer to suggest a battle type
    // Types are vote based, one vs. one, or tournament
    function conquerBattleAgreement() external {}

    // ================ PUBLIC BATTLE EVENT FUNCTIONS ================= //
    // @dev Lets members of factions in the same location join battler
    // Member must not be active in battle already
    function joinRaid(uint256 _raidId, uint256 _factionSupporting) external {
        require(
            idToRaid[_raidId].active,
            "This raid ID is invalid or not active"
        );
        require(
            idToRaid[_raidId].attackerId == _factionSupporting ||
                idToRaid[_raidId].defenderId == _factionSupporting,
            "The faction id used is not linked to this raid"
        );
        require(
            !activeInBattle[msg.sender],
            "You are already active in battle"
        );
        activeInBattle[msg.sender] = true;
        if (idToRaid[_raidId].defenderId == _factionSupporting) {
            idToRaid[_raidId].defenderStats += sqrt(factory.playerPower());
        } else {
            idToRaid[_raidId].attackerStats += sqrt(factory.playerPower());
        }
    }

    // @dev Lets members of factions in the same location join battler
    // Member must not be active in battle already
    function joinConquer(uint256 _conquerId, uint256 _factionSupporting)
        external
    {
        require(
            idToConquer[_conquerId].active,
            "This conquer ID is invalid or not active"
        );
        require(
            idToConquer[_conquerId].attackerId == _factionSupporting ||
                idToConquer[_conquerId].defenderId == _factionSupporting,
            "The faction id used is not linked to this conquering"
        );
        require(
            !activeInBattle[msg.sender],
            "You are already active in battle"
        );
        activeInBattle[msg.sender] = true;
        if (idToConquer[_conquerId].defenderId == _factionSupporting) {
            idToConquer[_conquerId].defenderStats += sqrt(
                factory.playerPower()
            );
        } else {
            idToConquer[_conquerId].attackerStats += sqrt(
                factory.playerPower()
            );
        }
    }

    //@dev Executing can be done by anybody once the cooldown has expired
    function executeConquerOutcome(uint256 _conquerId) external {
        require(
            idToConquer[_conquerId].conquerCooldown < block.timestamp,
            "Conquer timer has not expired"
        );
        require(
            idToConquer[_conquerId].active,
            "This conquering is not active"
        );
        idToConquer[_conquerId].active = false;
        uint256 attackerTotal = idToConquer[_conquerId].attackerStats**2;
        uint256 defenderTotal = idToConquer[_conquerId].defenderStats**2;
        uint256 attackerId = idToConquer[_conquerId].attackerId;
        uint256 defenderId = idToConquer[_conquerId].defenderId;
        if (attackerTotal > defenderTotal) {
            factionIdToArmy[defenderId].reserves -= ((factionIdToArmy[
                defenderId
            ].reserves / 100) * 80);
            factionIdToArmy[attackerId].reserves += ((factionIdToArmy[
                defenderId
            ].reserves / 100) * 80);
            factionIdToArmy[attackerId].reserves += idToConquer[_conquerId]
                .conquerBalance;
            factionIdToBattleManager[attackerId].conquerCooldown =
                block.timestamp +
                (86400);
            factionIdToBattleManager[defenderId].conquerDefenseCooldown = block
                .timestamp;
        } else {
            factionIdToArmy[defenderId].reserves += idToConquer[_conquerId]
                .conquerBalance;
            factionIdToBattleManager[attackerId].conquerCooldown =
                block.timestamp +
                (86400 * 2);
            factionIdToBattleManager[defenderId].conquerCooldown =
                block.timestamp +
                (86400 * 15);
        }
    }

    // @dev Raid outcomes can be executed by anybody as long as cooldown period has expired
    // If the attacker loses they have to wait 1 day until their next raid - defender is protected for 5 days
    // If attacker wins they can attack again in 12 hours - defender is protected for 2 days
    function executeRaidOutcome(uint256 _raidId) external {
        require(
            idToRaid[_raidId].raidCooldown < block.timestamp,
            "Raid timer has not expired"
        );
        require(idToRaid[_raidId].active, "This raid is not active");
        idToRaid[_raidId].active = false;
        uint256 attackerTotal = idToRaid[_raidId].attackerStats**2;
        uint256 defenderTotal = idToRaid[_raidId].defenderStats**2;
        if (attackerTotal > defenderTotal) {
            factionIdToArmy[idToRaid[_raidId].attackerId].reserves += idToRaid[
                _raidId
            ].raidBalance;
            factionIdToBattleManager[idToRaid[_raidId].attackerId]
                .raidCooldown = block.timestamp + (43200);
            factionIdToBattleManager[idToRaid[_raidId].defenderId]
                .raidDefenseCooldown = block.timestamp + (86400 * 2);
        } else {
            factionIdToArmy[idToRaid[_raidId].defenderId].reserves += idToRaid[
                _raidId
            ].raidBalance;
            factionIdToBattleManager[idToRaid[_raidId].attackerId]
                .raidCooldown = block.timestamp + (86400);
            factionIdToBattleManager[idToRaid[_raidId].defenderId]
                .raidCooldown = block.timestamp + (86400 * 5);
        }
    }

    // ================== PUBLIC ARMY FUNCTIONS ================ //
    function joinFactionArmy(uint256 _factionId) external {
        require(
            factionIdToArmy[_factionId].members >= 1,
            "This faction does not have an army"
        );
        require(
            factionFactory.isFactionMember(_factionId, msg.sender),
            "You are not part of this faction"
        );
        require(
            armyMember[msg.sender] == false,
            "You have already joined the army"
        );
        if (
            !factionIdToArmy[_factionId].limit ||
            (factionIdToArmy[_factionId].limit &&
                factionIdToArmy[_factionId].armySlots > 1)
        ) {
            Army storage army = factionIdToArmy[_factionId];
            armyMember[msg.sender] = true;
            army.members += 1;
            addressToWageCooldown[msg.sender] =
                block.timestamp +
                factionIdToArmy[_factionId].wageCooldown;
            if (factionIdToArmy[_factionId].armySlots > 1) {
                army.armySlots -= 1;
            }
        }
    }

    function leaveTheArmy(uint256 _factionId) external {
        require(
            factionFactory.isFactionMember(_factionId, msg.sender),
            "You are not part of this faction"
        );
        require(armyMember[msg.sender] == true, "You have not joined the army");
        Army storage army = factionIdToArmy[_factionId];
        armyMember[msg.sender] = false;
        army.members -= 1;
    }

    function claimWages(uint256 _factionId) external {
        require(
            factionFactory.isFactionMember(_factionId, msg.sender),
            "You are not part of this faction"
        );
        require(armyMember[msg.sender] == true, "You have not joined the army");
        require(
            factionIdToArmy[_factionId].reserves >=
                (factionIdToArmy[_factionId].payRate +
                    factionIdToArmy[_factionId].wageBonus),
            "Not enough reserves"
        );
        require(
            addressToWageCooldown[msg.sender] < block.timestamp,
            "You need to wait until your next wage"
        );
        addressToWageCooldown[msg.sender] += factionIdToArmy[_factionId]
            .wageCooldown;
        factionIdToArmy[_factionId].reserves -=
            factionIdToArmy[_factionId].payRate +
            factionIdToArmy[_factionId].wageBonus;
        armyBalance[msg.sender] +=
            factionIdToArmy[_factionId].payRate +
            factionIdToArmy[_factionId].wageBonus;
    }

    // =============== DEPOSIT FUNCTIONS ================== //
    function depositFunds(uint256 _factionId, uint256 _amount) external {
        require(
            factionFactory.isLeader(_factionId, msg.sender) ||
                factionIdToArmy[_factionId].armyLeader == msg.sender,
            "Only leaders or army leaders can assign army leaders"
        );
        Army storage army = factionIdToArmy[_factionId];
        army.reserves -= _amount;
        depositCounter.increment();
        depositCredit[depositCounter.current()] = true;
        factionFactory.depositFunds(
            _factionId,
            _amount,
            depositCounter.current()
        );
    }

    function depositEligible(uint256 _depositId)
        external
        view
        returns (bool value)
    {
        value = depositCredit[_depositId];
    }

    function changeDepositStatus(uint256 _depositId) external {
        depositCredit[_depositId] = false;
    }

    // ====================== INTERNAL FUNCTIONS ====================== //
    function sqrt(uint256 x) internal pure returns (uint256 y) {
        uint256 z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }
}
