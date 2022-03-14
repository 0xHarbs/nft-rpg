import './Panel.css';
import './Button.css'
import ContentCard from "./ContentCard"
import React from 'react';


function Panel() {
  return(
    <>
      <div className="panel">
        <div className="panel__container">
          <div className="text__container">
          <h1>Real Ownership</h1>
          <p>The first game that lets you <strong><u>own</u></strong> your character and influence their story.</p>
          <p></p>
          </div>
          <div className="card__container">
            <ContentCard 
            title="Mint Characters"
            image="https://i.pinimg.com/564x/4b/e5/9c/4be59cfa8f708e8697a680f47f048727.jpg"
            description="Own your character forever when it's minted as an NFT and use it in all of the world's we create.."
            actionCall="Play Now"
            />
            <ContentCard 
            title="Progress Onchain"
            image="https://i.pinimg.com/564x/56/66/ce/5666ce5d3121e4610d3104ef08fca531.jpg"
            description="Improve your character's stats, attacks and skill tree - all of your progress is stored on the blockchain."
            actionCall="Mint"
            />
            <ContentCard 
            title="Influence the Story"
            image="https://cdn.pixabay.com/photo/2020/05/30/08/49/fantasy-5238163_960_720.jpg"
            description="Vote how your character's story should unfold. Fight with other owners to influence the story. "
            actionCall="Play Free"
            />
          </div>
        </div>
      </div>
    </>
    )
}

export default Panel;