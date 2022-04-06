// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/IFactionFactory.sol";

contract FactionManager {
    IFactionFactory factionFactory;
    // ================ STRUCTS & ENUMS ================= //
    struct Coup {
        uint256 factionId;
        uint256 deadline;
        uint256 votesNeeded;
        uint256 votesFor;
        address newLeader;
        IFactionFactory.FactionType ruleType;
    }

    //@dev Rebellions can be used anywhere if there are enough for votes to change leader + rule type
    struct Rebellion {
        uint256 factionId;
        uint256 votesFor;
        uint256 votesNeeded;
        address newLeader;
        bool active;
        IFactionFactory.FactionType ruleType;
        mapping(address => bool) voted;
    }

    // ===================== MAPPINGS ====================== //
    mapping(uint256 => Rebellion) public factionIdToRebellion;
    mapping(uint256 => Coup) public factionIdToCoup;
    mapping(uint256 => bool) public factionToLeaderBlock;
    mapping(uint256 => bool) public withheldState;
    mapping(uint256 => bool) public leaderChangeCredit;

    constructor(address factionFactoryContract) {
        factionFactory = IFactionFactory(factionFactoryContract);
    }

    // ================= HEAD FUNCTIONS ==================== //
    // @dev Leadership block for army and coup initiated
    function createCoup(
        uint256 _factionId,
        IFactionFactory.FactionType _ruleType
    ) external {
        require(
            factionFactory.isHead(_factionId, msg.sender),
            "Only heads can create a coup"
        );
        factionToLeaderBlock[_factionId] = true;
        Coup storage coup = factionIdToCoup[_factionId];
        coup.deadline = block.timestamp + (86400 * 21);
        coup.newLeader = msg.sender;
        coup.ruleType = _ruleType;
        uint256 factionMembers;
        (, , , , , , , factionMembers, ) = factionFactory.getFaction(
            _factionId
        );
        coup.votesNeeded = factionMembers / 3;
        coup.votesFor += 1;
    }

    function executeCoup(uint256 _factionId) external {
        require(
            factionFactory.isHead(_factionId, msg.sender) ||
                factionFactory.isLeader(_factionId, msg.sender),
            "Only heads or the leader can execute a coup outcome"
        );
        require(
            block.timestamp > factionIdToCoup[_factionId].deadline,
            "Deadline has not passed yet"
        );
        factionToLeaderBlock[_factionId] = false;
        address leader;
        (, , , , leader, , , , ) = factionFactory.getFaction(_factionId);
        address contendingLeader = factionIdToCoup[_factionId].newLeader;
        if (
            factionIdToCoup[_factionId].votesFor >=
            factionIdToCoup[_factionId].votesNeeded
        ) {
            leaderChangeCredit[_factionId] = true;
            factionFactory.changeLeader(
                _factionId,
                contendingLeader,
                factionIdToCoup[_factionId].ruleType
            );
            factionFactory.flipHeadState(_factionId, leader);
        } else {
            factionFactory.flipHeadState(_factionId, contendingLeader);
            factionFactory.banishMember(_factionId, contendingLeader);
        }
        delete factionIdToCoup[_factionId];
    }

    // ================== PUBLIC REBELLION FUNCTIONS ================= //
    // // @dev Rebellion function to change leader and type of faction
    // // To create a rebellion, one must not be active, the faction must be large enough, the cooldown must be passed, and your rank must be sufficient
    function createRebellion(
        uint256 _factionId,
        address _newLeader,
        IFactionFactory.FactionType _factionType
    ) external {
        require(
            !factionIdToRebellion[_factionId].active,
            "A rebellion attempt is already action"
        );
        // require(
        //     idToFaction[_factionId].factionMembers >= 25,
        //     "The faction size must be >25 for a rebellion"
        // );
        uint256 rebellionCooldown;
        uint256 factionMembers;
        (, , , , , , rebellionCooldown, factionMembers, ) = factionFactory
            .getFaction(_factionId);
        require(
            rebellionCooldown < block.timestamp,
            "The cooldown has not been reached for a new rebellion"
        );
        Rebellion storage rebellion = factionIdToRebellion[_factionId];
        rebellion.factionId = _factionId;
        rebellion.votesFor += 1;
        rebellion.votesNeeded = ((factionMembers / 3) + 1);
        rebellion.newLeader = _newLeader;
        rebellion.ruleType = _factionType;
        rebellion.active = true;
    }

    // @dev Members of a faction can vote for a rebellion attempt
    function voteForRebellion(uint256 _factionId) external {
        require(
            factionIdToRebellion[_factionId].active == true,
            "There is not an active rebellion"
        );
        require(
            factionFactory.isFactionMember(_factionId, msg.sender),
            "You must be part of this faction to vote"
        );
        require(
            factionIdToRebellion[_factionId].voted[msg.sender] == false,
            "You have already voted"
        );
        factionIdToRebellion[_factionId].voted[msg.sender] == true;
        factionIdToRebellion[_factionId].votesFor += 1;
    }

    // @dev If the rebellion has enough votes then the leadership and rule type will change
    // Cooldown period is 6 weeks for new rebellions
    function executeRebellion(uint256 _factionId) external {
        require(
            factionIdToRebellion[_factionId].newLeader == msg.sender,
            "Only rebellion leaders can execute a rebellion"
        );
        Rebellion storage rebellion = factionIdToRebellion[_factionId];
        address currentLeader;
        (, , , , currentLeader, , , , ) = factionFactory.getFaction(_factionId);
        if (rebellion.votesFor >= rebellion.votesNeeded) {
            factionFactory.flipHeadState(_factionId, currentLeader);
            leaderChangeCredit[_factionId] = true;
            factionFactory.changeLeader(
                _factionId,
                rebellion.newLeader,
                rebellion.ruleType
            );
            if (!factionFactory.isHead(_factionId, msg.sender)) {
                factionFactory.flipHeadState(
                    _factionId,
                    factionIdToRebellion[_factionId].newLeader
                );
            }
        }
        delete factionIdToRebellion[_factionId];
        factionFactory.changeRebellionCooldown(_factionId);
    }

    function removeCredit(uint256 _factionId) external {
        require(
            factionFactory.isLeader(_factionId, msg.sender),
            "Only leaders can remove credits"
        );
        leaderChangeCredit[_factionId] = false;
    }

    // ============================= GETTER FUNCTIONS ================== //
    function stateWithheld(uint256 _factionId)
        external
        view
        returns (bool value)
    {
        value = withheldState[_factionId];
    }

    function leadershipChangeCredit(uint256 _factionId)
        external
        view
        returns (bool value)
    {
        value = leaderChangeCredit[_factionId];
    }
}
