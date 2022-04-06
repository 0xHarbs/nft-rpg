// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/IFactionManager.sol";
import "./interfaces/IArmyManager.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract FactionManager {
    address public _owner;
    IFactionManager manager;
    IArmyManager army;
    using Counters for Counters.Counter;
    Counters.Counter private factionCounter;
    uint256 autocracyRewardRate = 3;
    uint256 oligarchyRewardRate = 2;
    uint256 democracyRewardRate = 1;

    // ===================== STRUCTS & ENUMS ============== //
    // @dev Factions have different rule types, which are used to make decisions
    enum FactionType {
        DEMOCRACY,
        OLIGARCHY,
        AUTOCRACY
    }

    //@dev Factions have different rule structures and members
    struct Faction {
        uint256 id;
        string name;
        string description;
        string location;
        address leader;
        uint256 voteCooldown;
        uint256 rebellionCooldown;
        uint256 factionMembers;
        FactionType ruleType;
    }

    struct Law {
        uint256 factionId;
        uint256 lastVote;
        uint256 voteFrequency;
        uint256 taxRate;
        uint256 reserves;
        uint256 reserveRate;
        uint256 borderLimit;
        bool openBorder;
    }

    // ====================== EVENTS ============ //
    event ManagerChange(address sender, address managerChanged);
    event FactionCreated(address sender, uint256 factionId);

    // ================ MAPPINGS ================ //
    mapping(uint256 => uint256) public characterToFaction;
    mapping(address => uint256) public addressToFactionId;
    mapping(uint256 => Faction) public idToFaction;
    mapping(uint256 => Law) public factionIdToLaw;
    mapping(uint256 => uint256[]) public factionIdToAddressIds;
    mapping(address => bool) public factionManager;
    mapping(address => bool) public factionHead;
    mapping(address => uint256) public factionBalance;

    constructor(address factionManagerContract, address armyManagerContract) {
        _owner = msg.sender;
        manager = IFactionManager(factionManagerContract);
        army = IArmyManager(armyManagerContract);
    }

    // ================= ADMIN FUNCTIONS ============== //
    function changeManagerContract(address _contractAddress) external {
        require(msg.sender == _owner, "Only owner can change contract address");
        manager = IFactionManager(_contractAddress);
    }

    function createFaction(
        string memory _name,
        string memory _description,
        string memory _location,
        address _address,
        FactionType _type
    ) external {
        factionCounter.increment();
        Faction storage faction = idToFaction[factionCounter.current()];
        Law storage law = factionIdToLaw[factionCounter.current()];

        faction.id = factionCounter.current();
        faction.name = _name;
        faction.description = _description;
        faction.location = _location;
        faction.leader = _address;
        faction.ruleType = _type;
        faction.factionMembers += 1;
        factionHead[_address] = true;
        addressToFactionId[_address] = factionCounter.current();

        law.factionId = factionCounter.current();
        law.lastVote = block.timestamp;
        if (_type == FactionType.DEMOCRACY) {
            law.voteFrequency = (86400 * 150);
        } else if (_type == FactionType.OLIGARCHY) {
            law.voteFrequency == (86400 * 210);
        }
        emit FactionCreated(msg.sender, factionCounter.current());
    }

    function setLaws(
        uint256 _factionId,
        uint256 _taxRate,
        uint256 _reserveRate,
        uint256 _borderLimit,
        bool _openBorder
    ) external {
        require(
            idToFaction[_factionId].leader == msg.sender,
            "Only leader can set laws"
        );
        Law storage law = factionIdToLaw[_factionId];
        law.taxRate = _taxRate;
        law.reserves = 100000;
        law.reserveRate = _reserveRate;
        law.borderLimit = _borderLimit;
        law.openBorder = _openBorder;
    }

    // ================== FACTION MANAGER STATE FUNCTIONS ============ //
    // @dev Flip the state of an address to and from Manager
    function flipManagerState(uint256 _factionId, address _address) external {
        require(
            idToFaction[_factionId].leader == msg.sender ||
                (factionHead[msg.sender] &&
                    addressToFactionId[msg.sender] == _factionId),
            "Only leaders and heads can flip manager state"
        );
        require(
            idToFaction[_factionId].leader != _address,
            "Leaders manager status can not be changed"
        );
        require(
            addressToFactionId[_address] == _factionId,
            "This address is not part of your faction"
        );
        factionManager[_address] = !factionManager[_address];
        emit ManagerChange(msg.sender, _address);
    }

    function flipHeadState(uint256 _factionId, address _address) external {
        require(
            idToFaction[_factionId].leader == msg.sender ||
                (factionHead[msg.sender] &&
                    addressToFactionId[msg.sender] == _factionId),
            "Only leaders and heads can flip head state"
        );
        require(
            !manager.stateWithheld(_factionId),
            "Heads can't be changed in coups"
        );
        factionHead[_address] = !factionHead[_address];
    }

    // // @dev Leaders of factions can renounce leadership to a successor
    function renounceLeadership(uint256 _factionId, address _address) external {
        require(
            idToFaction[_factionId].leader == msg.sender,
            "You are not the leader of this faction"
        );
        require(factionManager[_address], "This address is not a manager");
        idToFaction[_factionId].leader = _address;
    }

    function changeStateType(uint256 _factionId, FactionType _ruleType)
        external
    {
        require(
            idToFaction[_factionId].leader == msg.sender,
            "Only leaders can change state type"
        );
        idToFaction[_factionId].ruleType = _ruleType;
    }

    // // @dev Taxes are set, which are levied on all earnings of faction members
    function setTax(uint256 _newTaxRate, uint256 _factionId) external {
        require(
            idToFaction[_factionId].leader == msg.sender,
            "Only leaders can change taxes"
        );
        require(_newTaxRate <= 100, "Tax rate can not be more than 100%");
        Law storage law = factionIdToLaw[_factionId];
        law.taxRate = _newTaxRate;
    }

    // @dev Reserve rate is the rate at which supply expands
    function setReserveRate(
        uint256 _factionId,
        uint256 _number,
        bool _direction
    ) external {
        require(
            idToFaction[_factionId].leader == msg.sender ||
                (factionHead[msg.sender] &&
                    addressToFactionId[msg.sender] == _factionId),
            "Only leaders and heads can flip manager state"
        );
        Law storage law = factionIdToLaw[_factionId];
        if (_direction == true) {
            law.reserveRate += _number;
        } else {
            require(law.reserveRate >= _number);
            law.reserveRate -= _number;
        }
    }

    function assignReserves(uint256 _factionId, uint256 _amount) external {
        require(
            idToFaction[_factionId].leader == msg.sender,
            "Only leaders or world bank can assign reserves"
        );
        Law storage law = factionIdToLaw[_factionId];
        law.reserves -= _amount;
    }

    function rewardAddress(
        uint256 _factionId,
        uint256 _amount,
        address _address
    ) external {
        require(
            idToFaction[_factionId].leader == msg.sender,
            "Caller must be faction leader"
        );
        require(
            _amount < (factionIdToLaw[_factionId].reserves / 20),
            "You can't gift more than 5% of reserves"
        );
        Law storage law = factionIdToLaw[_factionId];
        law.reserves -= _amount;
        factionBalance[_address] += _amount;
    }

    function flipBorderLaw(uint256 _factionId, uint256 _borderLimit) external {
        require(
            idToFaction[_factionId].leader == msg.sender ||
                (factionHead[msg.sender] &&
                    addressToFactionId[msg.sender] == _factionId),
            "Only leaders and heads can flip manager state"
        );
        Law storage law = factionIdToLaw[_factionId];
        law.openBorder = !law.openBorder;
        if (law.openBorder == false) {
            law.borderLimit = _borderLimit;
        }
    }

    // ==================== FACTION MANAGER MEMBER FUNCTIONS ================= //

    // // @dev Allows admins to deny or accept new faction members
    function decideOnNewMember(
        uint256 _pendingNumber,
        uint256 _factionId,
        address _newMember,
        bool choice
    ) external {
        require(
            idToFaction[_factionId].leader == msg.sender ||
                (factionHead[msg.sender] &&
                    addressToFactionId[msg.sender] == _factionId) ||
                (factionManager[msg.sender] &&
                    addressToFactionId[msg.sender] == _factionId),
            "This address is not a leader, head or manager for this faction"
        );
        Faction storage faction = idToFaction[_factionId];
        uint256 arrayLength = factionIdToAddressIds[_factionId].length;
        if (_pendingNumber == arrayLength) {
            factionIdToAddressIds[_factionId].pop();
        } else {
            factionIdToAddressIds[_factionId][
                _pendingNumber
            ] = factionIdToAddressIds[_factionId][arrayLength];
        }
        if (choice) {
            faction.factionMembers += 1;
            addressToFactionId[_newMember] = idToFaction[_factionId].id;
        }
    }

    function banishManager(uint256 _factionId, address _address) external {
        require(
            idToFaction[_factionId].leader == msg.sender ||
                (factionHead[msg.sender] &&
                    addressToFactionId[msg.sender] == _factionId),
            "Only leaders or heads can banish managers"
        );
        require(
            !factionHead[_address],
            "To banish faction head, visit correct contract"
        );
        Faction storage faction = idToFaction[_factionId];
        addressToFactionId[_address] = 0;
        faction.factionMembers -= 1;
        factionManager[_address] = false;
    }

    // @dev Allows leader to banish a member unless they are the army leader
    function banishMember(uint256 _factionId, address _address) external {
        require(
            idToFaction[_factionId].leader == msg.sender ||
                (factionHead[msg.sender] &&
                    addressToFactionId[msg.sender] == _factionId) ||
                (factionManager[msg.sender] &&
                    addressToFactionId[msg.sender] == _factionId),
            "Only leaders, heads, or managers can banish members"
        );
        require(
            !(idToFaction[_factionId].leader == msg.sender),
            "You can not banish leader"
        );
        require(!factionManager[msg.sender], "You can not banish managers");
        require(
            addressToFactionId[_address] == _factionId,
            "This address is not part of the faction"
        );
        Faction storage faction = idToFaction[_factionId];
        addressToFactionId[_address] = 0;
        faction.factionMembers -= 1;
    }

    function depositFunds(
        uint256 _factionId,
        uint256 _amount,
        uint256 _depositId
    ) external {
        require(
            army.depositEligible(_depositId),
            "This deposit id is not eligible for use"
        );
        require(
            factionHead[msg.sender],
            "Only faction managers can add to reserves"
        );
        army.changeDepositStatus(_depositId);
        Law storage law = factionIdToLaw[_factionId];
        law.reserves += _amount;
    }

    // ================= PUBLIC FUNCTIONS ============= //
    // @dev Allows users to join a faction if they are not already part of it or a leader
    // If the faction is open then they will instantly join
    function joinFaction(uint256 _factionId) external {
        require(
            addressToFactionId[msg.sender] != _factionId,
            "You can not join a faction you are already part of"
        );
        require(
            idToFaction[_factionId].leader != msg.sender,
            "You must renounce leadership before changing faction"
        );
        // require(addressToPlayer[msg.sender].id != 0, "You  must create a player profile");
        Law storage law = factionIdToLaw[_factionId];
        Faction storage faction = idToFaction[_factionId];
        if (law.openBorder) {
            faction.factionMembers += 1;
            addressToFactionId[msg.sender] = _factionId;
        } else if (law.borderLimit > 1) {
            faction.factionMembers += 1;
            law.borderLimit -= 1;
            addressToFactionId[msg.sender] = _factionId;
        }
        // else {
        //     factionIdToAddressIds[_factionId].push(addressToPlayer[msg.sender].id);
        // }
    }

    // // @dev Allows users to become factionless by leaving a faction
    function leaveFaction(uint256 _factionId) external {
        require(
            addressToFactionId[msg.sender] == _factionId,
            "You can not leave a faction you are not part of"
        );
        addressToFactionId[msg.sender] = 0;
    }

    function changeLeader(
        uint256 _factionId,
        address _newLeader,
        FactionType _ruleType
    ) external {
        require(
            manager.leadershipChangeCredit(_factionId),
            "There is no change credit"
        );
        Faction storage faction = idToFaction[_factionId];
        address oldLeader = faction.leader;
        faction.leader = _newLeader;
        faction.ruleType = _ruleType;
        addressToFactionId[oldLeader] = 0;
        manager.removeCredit(_factionId);
    }

    function changeRebellionCooldown(uint256 _factionId) external {
        Faction storage faction = idToFaction[_factionId];
        faction.rebellionCooldown = block.timestamp + (86400 * 150);
    }

    // ==================== GETTER FUNCTIONS ============== //
    function isLeader(uint256 _factionId, address _address)
        external
        view
        returns (bool value)
    {
        Faction memory faction = idToFaction[_factionId];
        value = _address == faction.leader;
    }

    function isHead(uint256 _factionId, address _address)
        external
        view
        returns (bool value)
    {
        require(
            addressToFactionId[_address] == _factionId,
            "Address is not part of this faction"
        );
        value = factionHead[_address];
    }

    function isManager(uint256 _factionId, address _address)
        external
        view
        returns (bool value)
    {
        require(
            addressToFactionId[_address] == _factionId,
            "Address is not part of this faction"
        );
        value = factionManager[_address];
    }

    // @dev Checks if an address is a member of a faction
    function isFactionMember(uint256 _factionId, address _address)
        external
        view
        returns (bool value)
    {
        value = (addressToFactionId[_address] == _factionId);
    }

    function addressToFaction() external view returns (uint256 faction) {
        faction = addressToFactionId[msg.sender];
    }

    // @dev Checks the reserves of a faction
    function getReserves(uint256 _factionId)
        external
        view
        returns (uint256 reserves)
    {
        reserves = factionIdToLaw[_factionId].reserves;
    }

    // @dev Gets the faction information for an id
    function getFaction(uint256 _factionId)
        external
        view
        returns (
            uint256 id,
            string memory name,
            string memory description,
            string memory location,
            address leader,
            uint256 voteCooldown,
            uint256 rebellionCooldown,
            uint256 factionMembers,
            FactionType ruleType
        )
    {
        Faction memory faction = idToFaction[_factionId];
        id = faction.id;
        name = faction.name;
        description = faction.description;
        location = faction.location;
        leader = faction.leader;
        voteCooldown = faction.voteCooldown;
        rebellionCooldown = faction.rebellionCooldown;
        factionMembers = faction.factionMembers;
        ruleType = faction.ruleType;
    }

    // @dev Gets the law information for a faction
    function getLaw(uint256 _factionId)
        external
        view
        returns (
            uint256 factionId,
            uint256 lastVote,
            uint256 voteFrequency,
            uint256 taxRate,
            uint256 reserves,
            uint256 reserveRate,
            uint256 borderLimit,
            bool openBorder
        )
    {
        Law storage law = factionIdToLaw[_factionId];
        factionId = law.factionId;
        lastVote = law.lastVote;
        voteFrequency = law.voteFrequency;
        taxRate = law.taxRate;
        reserves = law.reserves;
        reserveRate = law.reserveRate;
        borderLimit = law.borderLimit;
        openBorder = law.openBorder;
    }
}
