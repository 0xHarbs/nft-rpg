// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "./interfaces/IFactory.sol";

contract SkillTree {
    address public _owner;
    using Counters for Counters.Counter;
    Counters.Counter private skillCounter;
    uint256 resetCost;

    IFactory factory;

    // ============= STRUCTS & ENUMS ================= //
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

    struct Skill {
        uint256 id;
        uint256 levelRequired;
        uint256 cost;
        uint256 creditCost;
        string attackType;
        string visibility;
        TreeType treeType;
    }

    // ================ EVENTS ====================== //
    event SkillChange(address sender, uint256 skillId);
    event BalanceWithdrawn(address sender, uint256 amount);

    // ================= MAPPINGS ======================= //
    mapping(uint256 => uint256[]) public skillsUnlocked;
    mapping(uint256 => Skill) public idToSkill;

    constructor(address factoryAddress) {
        _owner = msg.sender;
        factory = IFactory(factoryAddress);
    }

    // ===================== ADMIN & HEAD SCIENTIST FUNCTIONS =============== //
    function createSkill(
        uint256 _levelRequired,
        uint256 _cost,
        uint256 _creditCost,
        string memory _attackType,
        string memory _visibility,
        TreeType _treeType
    ) external {
        require(
            factory.checkAdmin() || factory.checkCredits(),
            "Only admins or head scientists with credits can create skills"
        );
        skillCounter.increment();
        Skill storage skill = idToSkill[skillCounter.current()];
        skill.levelRequired = _levelRequired;
        skill.cost = _cost;
        skill.creditCost = _creditCost;
        skill.attackType = _attackType;
        skill.visibility = _visibility;
        skill.treeType = _treeType;
    }

    function editSkill(
        uint256 _skillId,
        uint256 _levelRequired,
        uint256 _cost,
        uint256 _creditCost,
        string memory _attackType,
        string memory _visibility,
        TreeType _treeType
    ) external {
        require(factory.checkAdmin(), "Only admins can change skills");
        require(idToSkill[_skillId].cost > 0, "This skill does not exist");
        Skill storage skill = idToSkill[_skillId];
        skill.levelRequired = _levelRequired;
        skill.cost = _cost;
        skill.creditCost = _creditCost;
        skill.attackType = _attackType;
        skill.visibility = _visibility;
        skill.treeType = _treeType;
        emit SkillChange(msg.sender, _skillId);
    }

    function changeSkillVisibility(uint256 _skillId, string memory _visibility)
        external
    {
        require(
            factory.checkAdmin() || factory.checkHeadScientist(),
            "Only admins or head scientists can change visibility"
        );
        Skill storage skill = idToSkill[_skillId];
        skill.visibility = _visibility;
    }

    function changeResetCost(uint256 _newCost) external {
        require(factory.checkAdmin(), "Only admins can change skills");
        require(_newCost > 0, "Cost can not be zero");
        resetCost = _newCost;
    }

    // ===================== PUBLIC FUNCTIONS ============= //
    function payForSkill(uint256 _characterId, uint256 _skillId)
        external
        payable
    {
        require(
            factory.characterOwned(_characterId, msg.sender),
            "You must be the character owner to reset tree"
        );
        uint256 level;
        (, , , level, , , , , , ) = factory.getCharacter(_characterId);
        require(
            level > idToSkill[_skillId].levelRequired,
            "Character level is not high enough"
        );
        require(
            msg.value == idToSkill[_skillId].cost,
            "Message value is less than cost of skill"
        );
        (bool sent, ) = address(this).call{value: msg.value}("");
        require(sent, "Transaction did not work");
        skillsUnlocked[_characterId].push(_skillId);
    }

    function unlockSkill(uint256 _characterId, uint256 _skillId)
        external
        payable
    {
        require(
            factory.characterOwned(_characterId, msg.sender),
            "You must be the character owner to unlock skill"
        );
        uint256 level;
        (, , , level, , , , , , ) = factory.getCharacter(_characterId);
        require(
            level > idToSkill[_skillId].levelRequired,
            "Character level is not high enough"
        );
        uint256 skillCredits;
        (, , , , skillCredits, ) = factory.getPlayer(msg.sender);
        require(
            skillCredits > idToSkill[_skillId].creditCost,
            "Not enough credits to unlock"
        );
        factory.changeSkillCredits(idToSkill[_skillId].creditCost, false);
        skillsUnlocked[_characterId].push(_skillId);
    }

    function resetSkillTree(uint256 _characterId) external payable {
        require(
            factory.characterOwned(_characterId, msg.sender),
            "You must be the character owner to reset tree"
        );
        require(msg.value >= resetCost, "Please send more ether to reset");
        uint256 creditsReimbursed;
        for (uint256 i; i < skillsUnlocked[_characterId].length; i++) {
            creditsReimbursed += idToSkill[skillsUnlocked[_characterId][i]]
                .creditCost;
        }
        (bool sent, ) = address(this).call{value: msg.value}("");
        require(sent, "Transaction failed");
        delete skillsUnlocked[_characterId];
        factory.changeSkillCredits(creditsReimbursed, true);
    }

    // ============== GETTER FUNCTIONS =================== //
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
        )
    {
        Skill memory skill = idToSkill[_skillId];
        id = skill.id;
        levelRequired = skill.levelRequired;
        cost = skill.cost;
        creditCost = skill.creditCost;
        attackType = skill.attackType;
        visibility = skill.visibility;
        treeType = skill.treeType;
    }

    // ============== FALLBACK FUNCTIONS ============== //
    function withdrawBalance() external {
        require(_owner == msg.sender);
        (bool sent, ) = (msg.sender).call{value: address(this).balance}("");
        require(sent, "Transaction failed");
        emit BalanceWithdrawn(msg.sender, address(this).balance);
    }

    receive() external payable {}

    fallback() external payable {}
}
