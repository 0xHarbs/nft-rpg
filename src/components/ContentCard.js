import './ContentCard.css';
import React from 'react';
import './Button.css'


function ContentCard({title, image, description, actionCall}) {
  return(
    <>
      <div className="contentCard">
      <div className="contentCard__imgContainer" style={{backgroundImage: `url(${image})`}}>
      </div>
        <div className="contentCardInfo">
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
    </>
    )
}

export default ContentCard;