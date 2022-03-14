import './Sidebar.css';
import React, {Component} from 'react';
import FighterCard from './FighterCard'
import {Link} from 'react-router-dom'

class Sidebar extends Component{
  render() {
  return(
    <div className="sidebar">
      <div className="sidebar__container">
        < FighterCard
         name={this.props.name}
         level={this.props.level}
         type="Brawler"
         id="2"
        />
        <div className="sidebar__buttons">
          <Link className="button__link" to="/fight">Fight!</Link>
        </div>
      </div>
    </div>
    )
  }
}

export default Sidebar;