// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IFactionManager {
    function stateWithheld(uint256 _factionId)
        external
        view
        returns (bool value);

    function leadershipChangeCredit(uint256 _factionId)
        external
        view
        returns (bool value);

    function removeCredit(uint256 _factionId) external;
}
