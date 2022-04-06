// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingManager {
    Counters.Counter private votes;

    // ==================== STRUCTS ====================== //
    //@dev Votes are used in a democracy or oligarchy to change rulers by voting
    struct Vote {
        uint256 factionId;
        uint256 voteDeadline;
        address[] candidates;
        bool active;
        mapping(address => uint256) candidateVotes;
        mapping(address => bool) voted;
    }

    // ===================== MAPPINGS ====================== //
    mapping(uint256 => Vote) public factionIdToVote;

    // ==================== LEADER FUNCTIONS ================ //
    // @dev A leader can dissolve a vote and change a faction to Autocratic rule
    function dissolveVote(uint256 _factionId, FactionType _ruleType) external {
        require(
            idToFaction[_factionId].leader == msg.sender,
            "Only leaders can change taxes"
        );
        delete factionIdToVote[_factionId];
        idToFaction[_factionId].ruleType = _ruleType;
    }

    // ====================== PUBLIC FUNCTIONS =================== //
    // @dev Votes for new leadership can be called by anybody in a democracy or by oligarchs in an oligarchy
    function createVote(uint256 _factionId, address[] calldata _candidates)
        external
    {
        require(
            addressToFactionId[msg.sender] == _factionId &&
                factionManager[msg.sender],
            "You can not trigger a vote unless you're a manager in a faction"
        );
        require(_candidates.length > 2, "Must be more than two candidates");
        if (
            idToFaction[_factionId].ruleType == FactionType.DEMOCRACY &&
            block.timestamp <
            (factionIdToLaw[_factionId].lastVote +
                factionIdToLaw[_factionId].voteFrequency)
        ) {
            Vote storage vote = factionIdToVote[_factionId];
            vote.factionId = _factionId;
            vote.candidates = _candidates;
            vote.voteDeadline = block.timestamp + (86400 * 21);
        } else if (
            idToFaction[_factionId].ruleType == FactionType.OLIGARCHY &&
            factionManager[msg.sender]
        ) {
            Vote storage vote = factionIdToVote[_factionId];
            vote.factionId = _factionId;
            vote.candidates = _candidates;
            vote.voteDeadline = block.timestamp + (86400 * 21);
        }
    }

    // @dev Members of a faction can vote for new leaders
    function voteForLeader(uint256 _factionId, address _candidate) external {
        require(
            factionIdToVote[_factionId].active == true,
            "There is not an active vote"
        );
        require(
            addressToFactionId[msg.sender] == _factionId,
            "You are not part of this faction"
        );
        require(
            factionIdToVote[_factionId].voted[msg.sender] == false,
            "You have already voted"
        );
        factionIdToVote[_factionId].voted[msg.sender] == true;
        // NEED TO TALLY VOTES FOR EACH ADDRESS
        factionIdToVote[_factionId].candidateVotes[_candidate] += 1;
    }

    // ================== INTERNAL FUNCTIONS =============== //
    // @dev Internal execution of the vote if past a set date
    // If it is a win then leader address changes and if it is a draw then a new vote is created
    function executeVote(uint256 _factionId) internal {
        Vote storage vote = factionIdToVote[_factionId];
        Faction storage faction = idToFaction[_factionId];
        Law storage law = factionIdToLaw[_factionId];
        uint256 maxVotes;
        address[] memory winningCandidate;
        for (uint256 i; i < vote.candidates.length; i++) {
            if (vote.candidateVotes[vote.candidates[i]] > maxVotes) {
                maxVotes = vote.candidateVotes[vote.candidates[i]];
                vote.candidates[i] = winningCandidate[0];
            } else if (vote.candidateVotes[vote.candidates[i]] == maxVotes) {
                vote.candidates[i] = winningCandidate[winningCandidate.length];
            }
        }
        if (winningCandidate.length == 1) {
            faction.leader = winningCandidate[0];
            law.lastVote = block.timestamp;
            factionManager[faction.leader] = true;
            delete factionIdToVote[_factionId];
        } else {
            delete factionIdToVote[_factionId];
            vote.factionId = _factionId;
            vote.candidates = winningCandidate;
            vote.voteDeadline = block.timestamp + (86400 * 21);
        }
    }
}
