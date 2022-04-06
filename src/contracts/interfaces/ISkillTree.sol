// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IFactory {
    enum TreeType {
        DAMAGE,
        CRITCHANCE,
        CRITDAMAGE,
        TOTALMANA,
        MANACOST,
        MANAREGEN,
        TOTALLIFE,
        LIFECOST,
        LIFEREGEN,
        SPEED
    }

    function createSkill(
        uint256 _levelRequired,
        uint256 _cost,
        uint256 _creditCost,
        string memory _attackType,
        string memory _visibility,
        TreeType _treeType
    ) external;

    function changeSkillVisibility(uint256 _skillId, string memory _visibility)
        external;

    function getSkill(uint256 _skillId)
        external
        view
        returns (
            uint256 id,
            uint256 levelRequired,
            uint256 cost,
            uint256 creditCost,
            string memory attackType,
            string memory visibility,
            TreeType treeType
        );
}
