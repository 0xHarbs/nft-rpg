// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IFactory {
    function getPlayer(address _address)
        external
        view
        returns (
            uint256 id,
            uint256 rank,
            uint256 attackCredits,
            uint256 characterCredits,
            uint256 skillCredits,
            address player
        );

    function getCharacter(uint256 _characterId)
        external
        view
        returns (
            address owner,
            string memory name,
            string memory build,
            uint256 level,
            uint256 hp,
            uint256 speed,
            uint256 xp,
            uint256 mana,
            uint256 manaRegen,
            uint256 baseId
        );

    function getAttack(uint256 _attackId)
        external
        view
        returns (
            uint256 id,
            string memory name,
            string memory description,
            uint256 attackDamage,
            uint256 critChance,
            uint256 critDamage,
            uint256 manaCost,
            string memory attackType,
            string memory visibility
        );

    function changeSkillCredits(uint256 _creditChange, bool _changeType)
        external;

    function isOwner() external view returns (bool value);

    function checkAdmin() external view returns (bool value);

    function checkHeadScientist() external view returns (bool value);

    function checkCredits() external view returns (bool value);

    function characterOwned(uint256 _characterId, address _address)
        external
        view
        returns (bool value);

    function playerPower() external view returns (uint256 value);
}
