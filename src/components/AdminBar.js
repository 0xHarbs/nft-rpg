import './AdminBar.css';
import React, {Component} from 'react';

class AdminBar extends Component{
  render() {
  return(
    <div className="adminbar">
      <div className="adminbar__container">
          <button className="adminbar__buttonContainer"
          onClick={(e) => {
            console.log("Overview pressed")
          }}
          >Overview Stats
          </button>
          <button className="adminbar__buttonContainer"
          onClick={(e) => {
            console.log("Create Character pressed")
          }}
          >Preview Characters
          </button>
          <button className="adminbar__buttonContainer"
          onClick={(e) => {
            console.log("Create Attack pressed")
          }}
          >Preview Attacks
          </button>
          <hr></hr>
          <button className="adminbar__buttonContainer"
          onClick={(e) => {
            console.log("Mint Characters")
            this.props.createStarters()
          }}
          >Mint Starter Characters
          </button>
          <button className="adminbar__buttonContainer"
          onClick={(e) => {
            this.props.createAttacks()
          }}
          >Mint Starter Attacks
          </button>
          <button className="adminbar__buttonContainer"
          onClick={(e) => {
            this.props.assignAttacks()
          }}
          >Assign Attacks
          </button>
      </div>
    </div>
    )
  }
}

export default AdminBar;