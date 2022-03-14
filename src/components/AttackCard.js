import './AttackCard.css';
import React from 'react';

function AttackCard({name, description, type, image, id, damage, damageType, manaCost}) {
  return(
    <div className="attackcard">
      <div className="attackcard__container">
        <div className="attackcard__title">
         <h3>{name}</h3>
        </div>
        <div className="attackcard__image">
          <img src={image} alt=""/>
        </div>
        <div className="attackcard__info">
          <div className="attackcard__description">
            <div className="attackcard__type">
              <p>{type}</p>
            </div>
            <p>{description}</p>
          </div>

          <div className="attackcard__stats">
            <hr></hr>
            <p>{damage}/{manaCost}</p>
          </div>
        </div>
      </div>
    </div>
    )
}

export default AttackCard;