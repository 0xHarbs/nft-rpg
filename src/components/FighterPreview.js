import './FighterPreview.css';
import React from 'react';
import './CardBackground.jpg'

function FighterPreview({img, type, name, description, hp, mana, speed, regen}) {
  return(
    <div className="fighterpreview">
      <div className="fighterpreview__container">
        <div className="fighterpreview__image">
          <img src={img} alt=""/>
        </div>
        <div className="fighterpreview__infoContainer">
          <div className="fighterpreview__basicInfo">
           <h3>{name}</h3>
           <p>{type}</p>
          </div>
          <div className="fighterpreview__description">
            <p>{description}</p>
          </div>
          <div className="fighterpreview__stats">
            <div className="fighterpreview__attackStats">
              <h3>Atk</h3>
              <p>{hp}</p>
            </div>
            <div className="fighterpreview__manaStats">
              <h3>Mna</h3>
              <p>{mana}</p>
            </div>
            <div className="fighterpreview__speedStats">
              <h3>Spd</h3>
              <p>{speed}</p>
            </div>
            <div className="fighterpreview__regenStats">
              <h3>Rgn</h3>
              <p>{regen}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
}

export default FighterPreview;