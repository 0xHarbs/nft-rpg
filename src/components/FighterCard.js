import './FighterCard.css';
import React from 'react';

function FighterCard({name, level, type, id}) {
  return(
    <div className="fightercard">
      <div className="fightercard__container">
         <h3>{name}</h3>
         <p>Lvl {level} | {type}</p>
      </div>
    </div>
    )
}

export default FighterCard;