import './Cover.css';
import React from 'react';
import {Link} from "react-router-dom"
import './Button.css'


function Cover() {
  return(
    <>
      <div id="overlay" className="cover">
        <div className="cover__container">
          <div className="text__container">
            <h1>The first community led RPG</h1>
            <p>Influence how the story of Wilderland unfolds and impact events with the characters you own.</p>
          </div>
          <div className="cover__buttonContainer">
          <Link to="/dash">
            <button className="btn__large">Play Free</button>
          </Link>
          </div>
        </div>
      </div>
    </>
    )
}

export default Cover;