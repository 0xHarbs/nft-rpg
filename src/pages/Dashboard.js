import React, {Component} from "react"
import Sidebar from '../components/Sidebar'
import Cardbar from '../components/Cardbar'
import '../components/Dashboard.css'
import SelectFighter from '../components/SelectFighter'
import MintAttacks from '../components/MintAttacks'
import {connectWallet, loadBlockchainData} from '../components/Methods'


class Home extends Component {

  async componentDidMount() {
    let account = await connectWallet()
    let wilderland = await loadBlockchainData()
    this.setState({account})
    this.setState({wilderland})
    await this.getUserData()
    if(!this.state.character) {
      await this.getCharacters()
    }
  }


  async getUserData() {
    let characterId = null
    try {
      characterId = await this.state.wilderland.methods.ownerCharacterIds(this.state.account, 0).call()
    } catch {
      console.log("No Characters")
      this.setState({needCharacter: true})
      return
    }
    this.setState({needCharacter: false})
    this.setState({characterId: characterId.toNumber() - 1})
    const userCharacter = await this.state.wilderland.methods.characters(this.state.characterId).call()
    this.setState({characterName: userCharacter.name})
    this.setState({characterLevel: userCharacter.level.toNumber()})
    this.setState({characterHp: userCharacter.hp.toNumber()})
    this.setState({characterManaRegen: userCharacter.manaRegen.toNumber()})
    this.setState({characterSpeed: userCharacter.speed.toNumber()})
    this.setState({characterMana: userCharacter.mana.toNumber()})

    if(this.state.characterName === "Trunk") {
      this.setState({attackSearchId: 0})
      console.log("Attack search sent", this.state.attackSearchId)
    } else if(this.state.characterName === "Demon") {
      this.setState({attackSearchId: 1})
    } else if (this.state.characterName === "Croc") {
      this.setState({attackSearchId: 2})
    } else if (this.state.characterName === "Python") {
      this.setState({attackSearchId: 3})
    } else if (this.state.characterName === "Hanar") {
      this.setState({attackSearchId: 4})
    }

    try {
      const attack = await this.state.wilderland.methods.characterToAttack((characterId.toNumber()-1), 0).call()
      this.setState({characterAttacks: [attack.name]})
      console.log(this.state.characterAttacks)
      for(let z = 1; z < 8; z++) {
        const attack = await this.state.wilderland.methods.characterToAttack((characterId.toNumber()-1), z).call()
        this.setState(prevState => ({
          characterAttacks: [...prevState.characterAttacks, attack.name]
        }))
        console.log(this.state.characterAttacks)
      }
      this.setState({needAttacks: false})
      this.showMintableAttacks()
    } catch {
      console.log("No user attacks!")
      this.setState({needAttacks: true})
      this.showMintableAttacks()
    }

  }


  async showMintableAttacks() {
    try {
      const attacksNeeded = (this.state.characterAttacks).length
      this.getMintableAttacks(attacksNeeded)
    } catch {
      console.log("Attacks needed = 4")
      const attacksNeeded = 3
      this.getMintableAttacks(attacksNeeded)
    }
  }


  async getMintableAttacks(attacksNeeded) {
    const attackSearchId = this.state.attackSearchId * 4
    const attackLimit = attackSearchId + 4
    console.log("Id multiplied", attackSearchId)
    for (let i = attackSearchId; i < attackLimit; i++) {
      const attack = await this.state.wilderland.methods.allAttacks(i).call()
      this.setState({attackList: [...this.state.attackList, attack.name]})
      this.setState({attackDescription:[...this.state.attackDescription, attack.description]})
      this.setState({attackType:[...this.state.attackType, attack.attackType]})
      this.setState({attackDamage:[...this.state.attackDamage, attack.attackDamage.toNumber()]})
      this.setState({attackManaCost:[...this.state.attackManaCost, attack.manaCost.toNumber()]})
      this.setState({attackCritChance:[...this.state.attackCritChance, attack.critChance.toNumber()]})
      this.setState({attackCritDamage:[...this.state.attackCritDamage, attack.critDamage.toNumber()]})
      this.setState({attackId:[...this.state.attackId, attack.id.toNumber()]})
    }
    for (let i = 20; i < 24; i++) {
      const attack = await this.state.wilderland.methods.allAttacks(i).call()
      this.setState({attackList: [...this.state.attackList, attack.name]})
      this.setState({attackDescription:[...this.state.attackDescription, attack.description]})
      this.setState({attackType:[...this.state.attackType, attack.attackType]})
      this.setState({attackDamage:[...this.state.attackDamage, attack.attackDamage.toNumber()]})
      this.setState({attackManaCost:[...this.state.attackManaCost, attack.manaCost.toNumber()]})
      this.setState({attackCritChance:[...this.state.attackCritChance, attack.critChance.toNumber()]})
      this.setState({attackCritDamage:[...this.state.attackCritDamage, attack.critDamage.toNumber()]})
      this.setState({attackId:[...this.state.attackId, attack.id.toNumber()]})
    }
    console.log(this.state.attackList)
    console.log(this.state.attackId)
  }

  async mintAttacks(num, searchId, characterId, account, contract) {
    const mintingId = (searchId *4) + num
    console.log("search is", characterId)
    await contract.methods.assignCharacterAttack(characterId, mintingId).send({from: account}).on('transactionHash', (hash) => {
      setTimeout(window.location.href='/dash', 3000)
    })
  }


  async getCharacters() {
    let character = await this.state.wilderland.methods.characters(0).call()
    this.setState({newCharacterName: [character.name]})
    this.setState({newCharacterHp: [(character.hp).toNumber()]})
    this.setState({newCharacterMana: [(character.mana).toNumber()]})
    this.setState({newCharacterManaRegen: [(character.manaRegen).toNumber()]})
    this.setState({newCharacterSpeed: [(character.speed).toNumber()]})

    for(let i = 1; i < 5; i++) {
      let character = await this.state.wilderland.methods.characters(i).call()
      this.setState({newCharacterName: [...this.state.newCharacterName, character.name]})
      this.setState({newCharacterHp: [...this.state.newCharacterHp, (character.hp).toNumber()]})
      this.setState({newCharacterMana: [...this.state.newCharacterMana, (character.mana).toNumber()]})
      this.setState({newCharacterManaRegen: [...this.state.newCharacterManaRegen, (character.manaRegen).toNumber()]})
      this.setState({newCharacterSpeed: [...this.state.newCharacterSpeed, (character.speed).toNumber()]})
    }
  }


  setId = async(num) => {
    await this.state.wilderland.methods.createCharacter(num).send({from: this.state.account})
    alert("Refresh the page after you have minted!")
  }


  constructor(props) {
    super(props)
    this.state = {
      account: '',
      wilderland: null,
      loading: true,
      character: null,
      characterCount: null,
      ownedCharacter: null,
      characterId: null,
      needCharacter: true,
      needAttacks: true,
      newCharacterName: [],
      newCharacterHp: [],
      newCharacterMana: [],
      newCharacterManaRegen: [],
      newCharacterSpeed: [],
      attackList: [],
      attackDescription: [],
      attackType: [],
      attackDamage: [],
      attackManaCost: [],
      attackCritChance: [],
      attackCritDamage: [],
      attackId: [],
      characterAttacks: [],
      imageUrls: [
      "https://i.pinimg.com/564x/6a/9a/33/6a9a3317db3c8a379596f4c292193a7d.jpg",
      "https://i.pinimg.com/564x/9e/ce/c5/9ecec5acdbb4f14a9f7853773fec68f0.jpg",
      "https://i.pinimg.com/564x/76/a1/39/76a139c7c8e67fc5ecf39b856eeffd33.jpg",
      "https://i.pinimg.com/564x/a1/67/6c/a1676c99fdef16a67ffa5a4e16afd9d7.jpg",
      "https://i.pinimg.com/564x/1f/8e/73/1f8e73890bffe4281adc3a76cbb33295.jpg"
      ]
    }
  }

	render() {
		return(
			<div className="dashboard__page">
        <div className="dash__main">
        {this.state.needCharacter
          ? <>
          <div className="title__container">
            <h1>Create Your Character</h1>
            <div className="createCharacter">
              <div className="createCharacter__container">
                <SelectFighter
                id="0"
                img={this.state.imageUrls[0]}
                name={this.state.newCharacterName[0]}
                type=""
                description="Warrior | perfectly balanced style to counter all opponents."
                hp={this.state.newCharacterHp[0]}
                mana={this.state.newCharacterMana[0]}
                regen={this.state.newCharacterManaRegen[0]}
                speed={this.state.newCharacterSpeed[0]}
                setId={this.setId}
                />
                <SelectFighter
                id="1"
                img={this.state.imageUrls[1]}
                name={this.state.newCharacterName[1]}
                type=""
                description="Leech | drains opponent's life to feed their own in battle."
                hp={this.state.newCharacterHp[1]}
                mana={this.state.newCharacterMana[1]}
                regen={this.state.newCharacterManaRegen[1]}
                speed={this.state.newCharacterSpeed[1]}
                setId={this.setId}
                />
                <SelectFighter
                id="2"
                img={this.state.imageUrls[2]}
                name={this.state.newCharacterName[2]}
                type=""
                description="Rush | outpaces opponent's in battle to deliver strong attacks"
                hp={this.state.newCharacterHp[2]}
                mana={this.state.newCharacterMana[2]}
                regen={this.state.newCharacterManaRegen[2]}
                speed={this.state.newCharacterSpeed[2]}
                setId={this.setId}
                />
                <SelectFighter
                id="3"
                img={this.state.imageUrls[3]}
                name={this.state.newCharacterName[3]}
                type=""
                description="Poison | infects opponent's with venom to drain their life force."
                hp={this.state.newCharacterHp[3]}
                mana={this.state.newCharacterMana[3]}
                regen={this.state.newCharacterManaRegen[3]}
                speed={this.state.newCharacterSpeed[3]}
                setId={this.setId}
                />
                <SelectFighter
                id="4"
                img={this.state.imageUrls[4]}
                name={this.state.newCharacterName[4]}
                type=""
                description="Bleed | heavy attacks leaving lasting damage to opponents."
                hp={this.state.newCharacterHp[4]}
                mana={this.state.newCharacterMana[4]}
                regen={this.state.newCharacterManaRegen[4]}
                speed={this.state.newCharacterSpeed[4]}
                setId={this.setId}
                />
              </div>
            </div>
          </div>
          </>
          :<> 
          <Sidebar 
          getMyAttacks={this.getMyAttacks}
          checkAttack={this.checkAttack}
          createAttacks={this.createAttacks}
          createCharacter={this.createCharacter}
          name={this.state.characterName}
          level={this.state.characterLevel}
          />
          {this.state.needAttacks
            && <MintAttacks 
            id={this.state.attackId}
            names={this.state.attackList}
            description={this.state.attackDescription}
            type={this.state.attackType}
            damage={this.state.attackDamage}
            manaCost={this.state.attackManaCost}
            critChance={this.state.attackCritChance}
            critDamage={this.state.attackCritDamage}
            mintedAttacks={this.state.characterAttacks}
            mintAttack={this.mintAttacks}
            searchId={this.state.attackSearchId}
            account={this.state.account}
            characterId={this.state.characterId}
            contract={this.state.wilderland}
            />
          }
          <Cardbar 
          name={this.state.characterName}
          hp={this.state.characterHp}
          mana={this.state.characterMana}
          regen={this.state.characterManaRegen}
          speed={this.state.characterSpeed}
          image={this.state.imageUrls[this.state.attackSearchId]}
          />
          </>
        }
        </div>
			</div>
			)
}	
}

export default Home;