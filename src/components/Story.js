import React from 'react';
import './Story.css'
import './Button.css'
import IdeaCard from './IdeaCard'

function Story() {
  return(
    <>
      <div className="story">
        <div className="story__container">
          <div className="text__container">
          <h1>Influence the world</h1>
          </div>
          <div className="story__bodyContainer">
            <p>We're building a world where the community decides how the story unfolds. Suggest characters, storylines, and world events...</p>
          </div>
          <div className="card__container">
            <IdeaCard 
            title="New Characters"
            itemOne="Rolf The Unforgiving"
            itemTwo="The Bloody Baron"
            itemThree=" Rotting Troll"
            />
            <IdeaCard 
            title="New Stories"
            itemOne="Into the Edril Caves"
            itemTwo="The Lost Sea Kingdom"
            itemThree="Alvero's Revenge"
            />
            <IdeaCard 
            title="World Events"
            itemOne="Darkness falls upon Rebafort"
            itemTwo="The Beastling Revolution"
            />
          </div>
          <button className="btn__large">Join now!</button>
        </div>
      </div>
    </>
    )
}

export default Story;