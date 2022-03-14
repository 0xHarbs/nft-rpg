import React from 'react';
import './Statcard.css'

function StatCard({name, number}) {
  return(
    <div className="statcard">
      <div className="statcard__container">
        <div className="statcard__title">
          <p>{name}</p>
          <h1 className="statcard__statNum">{number}</h1>
        </div>
      </div>
    </div>
    )
}

export default StatCard;