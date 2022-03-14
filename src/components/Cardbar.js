import './Cardbar.css';
import React, {Component} from 'react';
import FighterPreview from './FighterPreview'


class Cardbar extends Component{
  render() {
  return(
    <div className="cardbar">
      <div className="cardbar__container">
       <FighterPreview 
       img={this.props.image}
       name={this.props.name}
       description="Born in the mountains of Liberia and usurped by his brother Fauron. Trunk roams the wastelands waiting for the day of vengeance."
       hp={this.props.hp}
       mana={this.props.mana}
       speed={this.props.speed}
       regen={this.props.regen}
       type="Brawler, Elephantaur"
       />
      </div>
    </div>
    )
}
}

export default Cardbar;