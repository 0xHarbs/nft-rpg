// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IArmyManager {
    function depositEligible(uint256 _depositId)
        external
        view
        returns (bool value);

    function changeDepositStatus(uint256 _depositId) external;
}
