import React from 'react';
import './IdeaCard.css'

function IdeaCard({title, description, itemOne, itemTwo, itemThree, itemFour}) {
  return(
    <>
      <div className="ideaCard">
        <div className="ideaCardInfo">
          <h2><u>{title}</u></h2>
            <p>{itemOne}</p>
            <p>{itemTwo}</p>
            <p>{itemThree}</p>
            <p>{itemFour}</p>
        </div>
      </div>
    </>
    )
}

export default IdeaCard;