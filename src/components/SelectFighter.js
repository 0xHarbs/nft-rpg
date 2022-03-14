import './SelectFighter.css';
import React from 'react';

function SelectFighter({setId, id, img, type, name, description, hp, mana, speed, regen}) {
  return(
      <div className="selectfighter__container">
        <div className="selectfighter__image">
          <img src={img} alt=""/>
        </div>
        <div className="selectfighter__infoContainer">
          <div className="selectfighter__basicInfo">
           <h3>{name}</h3>
           <p>{type}</p>
          </div>
          <div className="selectfighter__description">
            <p>{description}</p>
          </div>
          <div className="selectfighter__stats">
            <div className="selectfighter__attackStats">
              <h3>Atk</h3>
              <p>{hp}</p>
            </div>
            <div className="selectfighter__manaStats">
              <h3>Mna</h3>
              <p>{mana}</p>
            </div>
            <div className="selectfighter__speedStats">
              <h3>Spd</h3>
              <p>{speed}</p>
            </div>
            <div className="selectfighter__regenStats">
              <h3>Rgn</h3>
              <p>{regen}</p>
            </div>
          </div>
        </div>
        <div className="select__buttonContainer">
          <button className="select__button" 
          onClick={(e) => {
            console.log(id)
            setId(id)
          }}>Select</button>
        </div>
      </div>
    )
}

export default SelectFighter;