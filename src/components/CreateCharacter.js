import React, {Component} from 'react';
import './CreateCharacter.css'

class CreateCharacter extends Component {

  render() {
  return(
    <div className="createcharacter">
      <div className="createcharacter__container">

      <div className="createcharacter__contentContainer">
      <h1 className="createcharacter__title">Create Character</h1>

      <div className="createcharacter__inputSection">
      	<input type="text" placeholder="Character name" onChange={(e) => this.setState({name: e.target.value})}/>
      	<input type="text" placeholder="Build" onChange={(e) => this.setState({build: e.target.value})}/>
      	<input type="text" placeholder="Lvl 1" disabled/>
      	<input type="number" placeholder="HP" onChange={(e) => this.setState({hp: e.target.value})}/>
      	<input type="number" placeholder="Mana" onChange={(e) => this.setState({mana: e.target.value})}/>
      	<input type="number" placeholder="Speed" onChange={(e) => this.setState({speed: e.target.value})}/>
      	<input type="text" placeholder="0 XP" disabled/>
      	<input type="number" placeholder={this.props.baseId} disabled />
      	<input type="number" placeholder="Mana Regen" onChange={(e) => this.setState({manaRegen: e.target.value})}/>
      	<button className="btn__primary" 
      	onClick={(e) => {
      		this.props.createCharacter(
      			this.state.name, this.state.build, this.state.hp, this.state.speed, this.state.mana, this.state.manaRegen, this.props.baseId)
      	}}
      	>Submit</button>
      </div>
      </div>

      </div>
    </div>
    )
}
}

export default CreateCharacter;