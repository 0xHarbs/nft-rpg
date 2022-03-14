// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Wilderland {
  string public name = 'Wilderland';
  uint public uniqueCharacters;
  uint public characterCount;
  uint public attackCount = 0;
  uint public memberCount = 0;
  uint nonce = 1;
  address _owner;

  struct Character {
    address owner;
    string name;
    string build;
    uint level;
    uint hp; // Used in fights
    uint speed; // Used in fights
    uint xp;
    uint mana;
    uint manaRegen;
    uint baseId;
  }

  struct Attacks {
      uint id;
      string name;
      string description;
      uint attackDamage;
      uint critChance;
      uint critDamage;
      uint manaCost;
      string attackType;
  }

  Attacks[] public allAttacks;
  Character[] public characters;
  mapping(uint => address) public characterToOwner; // Maps character to owner
  mapping(address => uint) ownerCharacterCount; // Counts owner characters
  mapping(uint => Attacks[]) public characterToAttack;
  mapping(address => uint[]) public ownerCharacterIds; // Maps owner to array or character ids

  function isOwner() public view returns(bool) {
    return msg.sender == _owner;
  }

  modifier onlyOwner() {
    require(isOwner());
    _;
  }

  constructor() {
    _owner = msg.sender;
    characterCount = 0;
  }

  function createStarters() external onlyOwner {
      createStartingCharacter('Trunk', 'Beast', 1, 500, 40, 0, 160, 15, 1);
      createStartingCharacter('Deeber', 'Darkling', 1, 325, 65, 0, 250, 25, 2);
      createStartingCharacter('Crocoz', 'Lizardman', 1, 375, 75, 0, 225, 20, 3);
      createStartingCharacter('Cobra', 'Monster', 1, 350, 70, 0, 200, 30, 4);
      createStartingCharacter('Hanar', 'Wildling', 1, 425, 55, 0, 195, 20, 5);
  }

  function createStartingCharacter(string memory _name, string memory _build, uint _level, uint _hp, uint _speed, uint _xp, uint _mana, uint _manaRegen, uint _baseId) public onlyOwner {
    characters.push(Character(msg.sender, _name, _build, _level, _hp, _speed, _xp, _mana, _manaRegen, _baseId));
    uint id = characters.length;
    characterToOwner[id] = msg.sender;
    ownerCharacterCount[msg.sender]++;
    ownerCharacterIds[msg.sender].push(id);
    characterCount++;
    uniqueCharacters++;
  }

  function createStartingAttacks() public onlyOwner {
    createAttack(0, 'Slash', 'Deadly attack to deceive opponents', 35, 25, 50, 25, 'Normal');
    createAttack(1, 'Roar', 'Belting roar to strike fear into the heart of opponents', 35, 50, 30, 30, 'Mana Damage');
    createAttack(2, 'Charge', 'Belting roar to strike fear into the heart of opponents', 50, 5, 25, 40, 'Normal');
    createAttack(3, 'Shield Wall', 'Grin and bear behind the shield to hold on', 25, 75, 3, 50, 'Deflect');
  }

  function assignStartingAttacks() public onlyOwner {
    assignCharacterAttack(0,0);
    assignCharacterAttack(0, 1);
    assignCharacterAttack(0,2);
    assignCharacterAttack(0,3);
  }

  function createAttack(uint _id, string memory _name, string memory _description, uint _damage, uint _critChance, uint _critDamage, uint _manaCost, string memory _type) public onlyOwner {
      allAttacks.push(Attacks(_id, _name, _description, _damage, _critChance, _critDamage, _manaCost, _type));
      attackCount++;
  }

  function createCharacter(uint _number) public {
    if(ownerCharacterCount[msg.sender] == 0) {
      memberCount++;
    }
    Character storage newCharacter = characters[_number]; 
    characters.push(Character(msg.sender, newCharacter.name, newCharacter.build, 1, newCharacter.hp, newCharacter.speed, newCharacter.xp, newCharacter.mana, newCharacter.manaRegen, newCharacter.baseId));
    uint id = characters.length;
    characterToOwner[id] = msg.sender;
    ownerCharacterCount[msg.sender]++;
    ownerCharacterIds[msg.sender].push(id);
    characterCount++;
  }

  function assignCharacterAttack(uint _characterId, uint _attackId) public {
    Attacks storage attack = allAttacks[_attackId];
    characterToAttack[_characterId].push(Attacks(attack.id, attack.name, attack.description, attack.attackDamage, attack.critChance, attack.critDamage, attack.manaCost, attack.attackType));
  }

    function playerWins(uint _id) public {
        Character storage myCharacter = characters[_id];
        myCharacter.xp += 30;
        if (myCharacter.xp > 100) {
            levelUp(_id);
        }
    }

    function levelUp(uint _id) internal {
        Character storage myCharacter = characters[_id];
        myCharacter.level++;
        myCharacter.xp = 0;
    }

}