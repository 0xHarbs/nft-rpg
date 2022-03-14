import './MintAttacks.css';
import React from 'react';

function MintAttacks({contract, account, characterId, searchId, id, names, description, type, damage, manaCost, critChance, critDamage, mintedAttacks, mintAttack}) {
  return(
    <div className="mintattacks">
      <div className="mintattacks__container">
      {names.map((name, index) => {
        return <>
          <div className="mintattack__card">
            <div className="actionbox__attackTitle">
              <h3>{names[index]}</h3>
              <p>({type[index]})</p>
            </div>
            <p className="attack__description">{description[index]}.</p>
            <div className="actionbox__statLine">
              <div className="actionbox__chanceInfo">
                <h3>Dmg</h3>
                <p>{damage[index]}</p>
              </div>
              <div className="actionbox__chanceImpact">
                <h3>Man</h3>
                <p>{manaCost[index]}</p>
              </div>
            </div>
            <div className="actionbox__statLine">
              <div className="actionbox__chanceInfo">
              {type[index] === "Sleep" || type[index] === "Poison" 
                  ? <h3>Chance</h3>
                  : <h3>Crit Chance</h3>
                }
                <p>{critChance[index]}%</p>
              </div>
              <div className="actionbox__chanceImpact">
                {type[index] === "Sleep" || type[index] === "Poison" || type[index] === "Leech" || type[index] === "Deflect" || type[index] === "Defense" 
                  ? <>
                  <h3>Counters</h3>
                  <p>{critDamage[index]}</p>
                  </>
                  : <>
                  <h3>Crit Dmg</h3>
                  <p>{critDamage[index]}%</p>
                  </>
                }
              </div>
            </div>
            {mintedAttacks.includes(names[index])
              ? <button disabled={true} className="mintattack__button">Minted</button>
              : <button onClick={(e) => {
                mintAttack(id[index], searchId, characterId, account, contract)
              }}className="mintattack__button">Mint</button>
            }
          </div>
        </>
      })}
      </div>
    </div>
    )
}

export default MintAttacks;