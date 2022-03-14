import React, {Component} from "react"
import AdminBar from '../components/AdminBar'
import AdminStats from '../components/AdminStats'
import '../components/Admin.css'
import {connectWallet, loadBlockchainData} from '../components/Methods'

class Admin extends Component {

  async componentDidMount() {
    let account = await connectWallet()
    let wilderland = await loadBlockchainData()
    this.setState({account})
    this.setState({wilderland})
    await this.getGameData()
  }

  async getGameData() {
    const uniqueCharacters = await this.state.wilderland.methods.uniqueCharacters().call()
    const characterCount = await this.state.wilderland.methods.characterCount().call()
    const memberCount = await this.state.wilderland.methods.memberCount().call()
    const attackCount = await this.state.wilderland.methods.attackCount().call()
    this.setState({uniqueCharacters: uniqueCharacters.toNumber()})
    this.setState({characters: characterCount.toNumber()})
    this.setState({users: memberCount.toNumber()})
    this.setState({attacks: attackCount.toNumber()})
    console.log("Character Count: " + this.state.characters + ". Members: " + memberCount + ". Attacks: " + attackCount)
  }

  createStarters = async () => {
    await this.state.wilderland.methods.createStarters().send({from: this.state.account})
  }

  createStartingAttacks= async () => {
    await this.state.wilderland.methods.createStartingAttacks().send({from: this.state.account})
  }

  assignAttacks = async () => {
    await this.state.wilderland.methods.assignStartingAttacks().send({from: this.state.account})
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      characters: 0,
      attacks: 0,
      users: 1
    }
  }

  render() {
    return(
      <div className="admin__page">
        <div className="admin__main">
          <AdminBar 
          assignAttacks={this.assignAttacks}
          createAttacks={this.createStartingAttacks}
          createStarters={this.createStarters}
          />
          <AdminStats 
          uniqueCharacters={this.state.uniqueCharacters}
          characters={this.state.characters}
          attacks={this.state.attacks}
          users={this.state.users}
          />
        </div>
      </div>
      )
}
}

export default Admin;