import './AdminStats.css';
import React, {Component} from 'react';
import StatCard from './StatCard'
import CreateCharacter from './CreateCharacter'
import CreateAttack from './CreateAttack'
import {connectWallet, loadBlockchainData} from '../components/Methods'

class AdminStats extends Component {

  async componentDidMount() {
    let account = await connectWallet()
    let wilderland = await loadBlockchainData()
    this.setState({account})
    this.setState({wilderland})
    this.getBaseId()
  }

  getBaseId = async() => {
    let baseId = await this.state.wilderland.methods.uniqueCharacters().call()
    baseId = baseId.toNumber()
    this.setState({baseId})
  }

  createCharacter = async (name, build, hp, speed, mana, manaRegen, baseId) => {
    await this.state.wilderland.methods.createStartingCharacter(name, build, 1, hp, speed, 0, mana, manaRegen, baseId).send({from: this.state.account})
  }

  createAttack = async(name, description, damage, critChance, critDamage, cost, type) => {
    let id = await this.state.wilderland.methods.attackCount().call()
    id = id.toNumber()
    console.log("Id is: ", id)
    await this.state.wilderland.methods.createAttack(
      id, name, description, damage, critChance, critDamage, cost, type
      ).send({from: this.state.account})
  }

    constructor(props) {
    super(props)
    this.state = {
      account: '',
      baseId: null
    }
  }

  render() {
  return(
    <div className="adminstats">
      <div className="adminstats__container">
          <StatCard 
          name="Unique Characters"
          number={this.props.uniqueCharacters}
          />
          <StatCard 
          name="Unique Attacks"
          number={this.props.attacks}
          />
          <StatCard 
          name="Unique Members"
          number={this.props.users}
          />
          <StatCard 
          name="Minted Characters"
          number={this.props.characters - this.props.uniqueCharacters}
          />
          <StatCard 
          name="Characters by Member"
          number={this.props.characters > 1 ? (this.props.characters - this.props.uniqueCharacters)/ this.props.users : 0}
          />
          <StatCard 
          name="AVG Attacks Owned"
          number={this.props.attack > 1 ? this.props.attacks/ this.props.users : 0}
          />
          <CreateCharacter 
          createCharacter={this.createCharacter} 
          baseId={this.state.baseId} />
          <CreateAttack createAttack={this.createAttack} />
      </div>
    </div>
    )
}
}

export default AdminStats;