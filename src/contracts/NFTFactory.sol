// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract Wilderland is ERC1155 {
    address public _owner;
    uint256 public uniqueCharacters;
    uint256 public characterCount;
    uint256 public attackCount;
    uint256 public memberCount;
    uint256 public maxCharacters = 20;
    uint256 public characterCost = 0.05 ether;
    uint256 public attackCost = 0.005 ether;

    // ====================== STRUCTS ================== //
    struct Player {
        uint256 id;
        uint256 rank;
        uint256 attackCredits;
        uint256 characterCredits;
        uint256 skillCredits;
        address player;
    }

    struct Character {
        address owner;
        string name;
        string build;
        uint256 level;
        uint256 hp; // Used in fights
        uint256 speed; // Used in fights
        uint256 xp;
        uint256 mana;
        uint256 manaRegen;
        uint256 baseId;
    }

    struct Attack {
        uint256 id;
        string name;
        string description;
        uint256 attackDamage;
        uint256 critChance;
        uint256 critDamage;
        uint256 manaCost;
        string attackType;
        string visibility;
    }

    // ======================= EVENTS =========================== //
    event LevelUp(address player, uint256 characterId);

    // ========================== MAPPINGS & ARRAYS ================== //
    Attack[] public allAttacks;
    Character[] public characters;
    mapping(uint256 => address) public characterToOwner; // Maps character to owner
    mapping(address => uint256) ownerCharacterCount; // Counts owner characters
    mapping(uint256 => Attack[]) public characterToAttack;
    mapping(address => uint256[]) public ownerCharacterIds; // Maps owner to array or character ids
    mapping(address => Player) public addressToPlayer;
    mapping(address => bool) public adminList;
    mapping(address => bool) public headScientist;
    mapping(address => uint256) public scientistCredits; // Credits to be used for skills or attacks

    // ====================== MODIFIERS ===================== //
    // Change to inherit Ownable
    // Add admin functions and admin mappings
    modifier onlyAdmin() {
        require(adminList[msg.sender]);
        _;
    }

    constructor() ERC1155("") {
        _owner = msg.sender;
        adminList[msg.sender] = true;
        characterCount = 0;
    }

    // ================== ADMIN FUNCTIONS ================= //
    function flipAdminState(address _address) external onlyAdmin {
        adminList[_address] = !adminList[_address];
    }

    // @dev Allows an admin to assign a batch of attacks to a character
    function assignBatchAttacks(
        uint256 _characterId,
        uint256[] calldata _attackIds
    ) external onlyAdmin {
        for (uint256 i; i < _attackIds.length; i++) {
            assignCharacterAttack(_characterId, _attackIds[i]);
        }
    }

    // @dev Allows an admin to create a new attack
    function createAttack(
        uint256 _id,
        string memory _name,
        string memory _description,
        uint256 _damage,
        uint256 _critChance,
        uint256 _critDamage,
        uint256 _manaCost,
        string memory _type,
        string memory _visibility
    ) public {
        require(
            adminList[msg.sender] || scientistCredits[msg.sender] > 1,
            "You are not a scientist or admin"
        );
        scientistCredits[msg.sender] -= 1;
        allAttacks.push(
            Attack(
                _id,
                _name,
                _description,
                _damage,
                _critChance,
                _critDamage,
                _manaCost,
                _type,
                _visibility
            )
        );
        attackCount++;
    }

    // @dev Allows an admin to create a starting character base model
    function mintStartingCharacter(
        string memory _name,
        string memory _build,
        uint256 _level,
        uint256 _hp,
        uint256 _speed,
        uint256 _xp,
        uint256 _mana,
        uint256 _manaRegen,
        uint256 _baseId,
        uint256 _supply
    ) public onlyAdmin {
        characters.push(
            Character(
                msg.sender,
                _name,
                _build,
                _level,
                _hp,
                _speed,
                _xp,
                _mana,
                _manaRegen,
                _baseId
            )
        );
        uint256 id = characters.length;
        characterToOwner[id] = msg.sender;
        ownerCharacterCount[msg.sender]++;
        ownerCharacterIds[msg.sender].push(id);
        characterCount++;
        uniqueCharacters++;
        _mint(address(this), id, _supply, "");
    }

    //@dev Changes the max number of characters a user can own
    function changeMaxCharacterNum(uint256 _num) external onlyAdmin {
        maxCharacters = _num;
    }

    //@dev Changes the cost to buy a character
    function changeCharacterCost(uint256 _newCost) external onlyAdmin {
        characterCost = _newCost;
    }

    // ==================== PUBLIC FUNCTIONS ===================== //
    // @dev Lets an addres create a character using a base model
    // !! Add mintint with ERC1155 - check wallet size for character !> 3
    function createCharacter(uint256 _number) public payable {
        if (ownerCharacterCount[msg.sender] == 0) {
            memberCount++;
        }
        require(
            ownerCharacterCount[msg.sender] < maxCharacters,
            "You have minted the max number of characters"
        );
        require(
            msg.value > characterCost ||
                addressToPlayer[msg.sender].characterCredits >= 1,
            "You need to send more Eth to create a character or earn a credit"
        );
        Character storage newCharacter = characters[_number];
        characters.push(
            Character(
                msg.sender,
                newCharacter.name,
                newCharacter.build,
                1,
                newCharacter.hp,
                newCharacter.speed,
                newCharacter.xp,
                newCharacter.mana,
                newCharacter.manaRegen,
                newCharacter.baseId
            )
        );
        uint256 id = characters.length;
        characterToOwner[id] = msg.sender;
        ownerCharacterCount[msg.sender]++;
        ownerCharacterIds[msg.sender].push(id);
        characterCount++;
        safeTransferFrom(address(this), msg.sender, _number, 1, "");
    }

    // @dev Lets address assign attacks to characters
    // !! Add fee to mint attacks?
    function assignCharacterAttack(uint256 _characterId, uint256 _attackId)
        public
        payable
    {
        require(
            msg.value > attackCost ||
                addressToPlayer[msg.sender].attackCredits >= 1,
            "You need to send more Eth to create a character or earn a credit"
        );
        Attack storage attack = allAttacks[_attackId];
        characterToAttack[_characterId].push(
            Attack(
                attack.id,
                attack.name,
                attack.description,
                attack.attackDamage,
                attack.critChance,
                attack.critDamage,
                attack.manaCost,
                attack.attackType,
                attack.visibility
            )
        );
    }

    // @dev Function used by scientists or admins to change visibility of an attack
    function changeAttackVisibility(uint256 _attackId, string memory _type)
        external
    {
        require(
            adminList[msg.sender] || headScientist[msg.sender],
            "You are not a scientist or admin"
        );
        Attack storage attack = allAttacks[_attackId];
        attack.visibility = _type;
    }

    // @dev Called when a player wins a battle - to increase XP
    // Win types will correspond with battle type i.e. computer, computer boss, PvP, and Ranked
    function playerWins(uint256 _id, uint256 _winType) external {
        Character storage myCharacter = characters[_id];
        uint256 xp;
        if (_winType == 0) {
            xp = 20;
            myCharacter.xp += 20;
        } else if (_winType == 1) {
            xp = 30;
            myCharacter.xp += 30;
        } else if (_winType == 2) {
            xp = 40;
            myCharacter.xp += 40;
        } else if (_winType == 3) {
            xp = 50;
            myCharacter.xp += 50;
        }
        if (myCharacter.xp > ((100 / 10) * (myCharacter.level * 4))) {
            levelUp(_id, xp);
        }
    }

    // @dev If change type is true then add credits whereas if it's false then minus
    function changeSkillCredits(uint256 _creditChange, bool _changeType)
        external
    {
        if (_changeType) {
            addressToPlayer[msg.sender].skillCredits += _creditChange;
        } else {
            addressToPlayer[msg.sender].skillCredits -= _creditChange;
        }
    }

    // =============== GETTER FUNCTIONS ==================== //
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
        )
    {
        Player storage playerProfile = addressToPlayer[_address];
        id = playerProfile.id;
        rank = playerProfile.rank;
        attackCredits = playerProfile.attackCredits;
        characterCredits = playerProfile.characterCredits;
        skillCredits = playerProfile.skillCredits;
        player = playerProfile.player;
    }

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
        )
    {
        Character storage character = characters[_characterId];
        owner = character.owner;
        name = character.name;
        build = character.build;
        level = character.level;
        hp = character.hp;
        speed = character.speed;
        xp = character.xp;
        mana = character.mana;
        manaRegen = character.manaRegen;
        baseId = character.baseId;
    }

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
        )
    {
        Attack storage attack = allAttacks[_attackId];
        id = attack.id;
        name = attack.name;
        description = attack.description;
        attackDamage = attack.attackDamage;
        critChance = attack.critChance;
        critDamage = attack.critDamage;
        manaCost = attack.manaCost;
        attackType = attack.attackType;
        visibility = attack.visibility;
    }

    function checkAdmin() external view returns (bool value) {
        value = adminList[msg.sender];
    }

    function checkHeadScientist() external view returns (bool value) {
        value = headScientist[msg.sender];
    }

    function checkCredits() external view returns (bool value) {
        value = scientistCredits[msg.sender] > 1;
    }

    function characterOwned(uint256 _characterId, address _address)
        external
        view
        returns (bool value)
    {
        value = (characterToOwner[_characterId] == _address);
    }

    function playerPower() external view returns (uint256 value) {
        for (uint256 i; i < ownerCharacterCount[msg.sender]; i++) {
            uint256 id = ownerCharacterIds[msg.sender][i];
            value += characters[id].level;
        }
    }

    // =============== INTERNAL FUNCTIONS ================== //
    // @dev Called when a players XP is > 100 to level up
    function levelUp(uint256 _id, uint256 xp) internal {
        Character storage myCharacter = characters[_id];
        uint256 nextLevel = ((100 / 10) * (myCharacter.level * 4));
        uint256 xpTotal = myCharacter.xp + xp;
        myCharacter.xp = xpTotal - nextLevel;
        myCharacter.level++;
        // Implement ERC20 reward system via an interface
        // token.rewardPlayer();
        emit LevelUp(msg.sender, _id);
    }

    // ================= FALLBACK FUNCTIONS ============== //
    function withdrawFunds() external payable {
        require(msg.sender == _owner);
        (bool sent, ) = (msg.sender).call{value: address(this).balance}("");
        require(sent, "Transaction failed");
    }

    receive() external payable {}

    fallback() external payable {}
}
