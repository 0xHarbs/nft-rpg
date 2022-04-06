// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IFactionFactory {
    enum FactionType {
        DEMOCRACY,
        OLIGARCHY,
        AUTOCRACY
    }

    function flipManagerState(uint256 _factionId, address _address) external;

    function flipHeadState(uint256 _factionId, address _address) external;

    function banishMember(uint256 _factionId, address _address) external;

    function changeLeader(
        uint256 _factionId,
        address _newLeader,
        FactionType _ruleType
    ) external;

    function isLeader(uint256 _factionId, address _address)
        external
        view
        returns (bool value);

    function isHead(uint256 _factionId, address _address)
        external
        view
        returns (bool value);

    function isManager(uint256 _factionId, address _address)
        external
        view
        returns (bool value);

    function isFactionMember(uint256 _factionId, address _address)
        external
        view
        returns (bool value);

    function getReserves(uint256 _factionId)
        external
        view
        returns (uint256 reserves);

    function assignReserves(uint256 _factionId, uint256 _amount) external;

    function changeRebellionCooldown(uint256 _factionId) external;

    function depositFunds(
        uint256 _factionId,
        uint256 _amount,
        uint256 _depositId
    ) external;

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
        );

    function addressToFaction() external view returns (uint256 faction);

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
        );
}
