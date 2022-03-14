import React, {Component} from 'react';
import './CreateAttack.css'

class CreateAttack extends Component {

  render() {
  return(
    <div className="createattack">
      <div className="createattack__container">

      <div className="createattack__contentContainer">
      <h1 className="createattack__title">Create Attack</h1>

      <div className="createattack__inputSection">
      	<input type="text" placeholder="Attack name" onChange={(e) => this.setState({name: e.target.value})}/>
      	<input type="text" placeholder="Type" onChange={(e) => this.setState({type: e.target.value})}/>
      	<input type="number" placeholder="Cost" onChange={(e) => this.setState({cost: e.target.value})}/>
      	<input type="number" placeholder="Impact" onChange={(e) => this.setState({attack: e.target.value})}/>
      	<input type="number" placeholder="Crit Chance or Chance" onChange={(e) => this.setState({critChance: e.target.value})}/>
      	<input type="number" placeholder="Crit Damage or Counters" onChange={(e) => this.setState({critDamage: e.target.value})}/>
        <textarea placeholder="Attack description" cols="80" rows="3" onChange={(e) => this.setState({description: e.target.value})}></textarea>

      </div>
        <button className="btn__primary" 
        onClick={(e) => {
          console.log("Creating Attack")
          console.log(this.state.name)
          console.log(this.state.type)
          console.log(this.state.cost)
          console.log(this.state.attack)
          console.log(this.state.critChance)
          console.log(this.state.critDamage)
          console.log(this.state.description)
          this.props.createAttack(this.state.name, this.state.description, this.state.attack, this.state.critChance, this.state.critDamage, this.state.cost, this.state.type)
        }}
        >Submit</button>
      </div>

      </div>
    </div>
    )
}
}

export default CreateAttack;