import './Opponent.css';
import React, {Component} from 'react';

class Opponent extends Component {
  render() {
  return(
    <>
      <div id="overlay" className="opponent">
        <div className="opponent__container">
          <div className="opponent__textInfo">
            <div className="opponent__textTop">
              <div className="opponent__textLeft">
              <div>
                <h3>{this.props.name}</h3>
              </div>
                <p>Lvl {this.props.level}</p>
              </div>
              <div className="opponent__textRight">
                <div className="opponent__data">
                  <p><strong>HP |</strong> {this.props.hp} / {this.props.totalHp}</p>
                  <p><strong>Mana |</strong> {this.props.mana} / {this.props.totalMana}</p>
                </div>
              </div>
            </div>
            <div className="opponent__hp">
              <div className="opponent__hpBar" style={{width: this.props.hpPercent}}>
              </div>
            </div>
            <div className="opponent__mana">
              <div className="opponent__manaBar" style={{width: this.props.manaPercent}}>
              </div>
            </div>
          </div>

          <div className="opponent__effects">
            {this.props.poison && <>
              <div className="opponent__effectBoxes">
                <h3 style={{backgroundColor: '#00a645'}}>Psn</h3>
                <p style={{color: '#00a645'}}>{this.props.poisonDmg}</p>
              </div>
              <p className="opponent__counter" style={{backgroundColor: '#00a645'}}>{this.props.poisonCounter}</p>
              </>
            }
            {this.props.sleep && <>
              <div className="opponent__effectBoxes">
                <h3 style={{backgroundColor: '#00ddfa'}}>Slp</h3>
                <p style={{color: '#00ddfa'}}>0</p>
              </div>
              <p className="opponent__counter" style={{backgroundColor: '#00ddfa'}}>{this.props.sleepCounter}</p>
              </>
            }
            {this.props.leech && <>
              <div className="opponent__effectBoxes">
                <h3 style={{backgroundColor: '#990000'}}>Lch</h3>
                <p style={{color: '#990000'}}>{this.props.leechDmg}</p>
              </div>
              <p className="opponent__counter" style={{backgroundColor: '#990000'}}>{this.props.leechCounter}</p>

              </>}
            {this.props.defense && <>
              <div className="opponent__effectBoxes">
                <h3 style={{backgroundColor: '#00ADF8'}}>Def</h3>
                <p style={{color: '#00ADF8'}}>{this.props.defenseDmg}</p>
              </div>
              <p className="opponent__counter" style={{backgroundColor: '#00ADF8'}}>{this.props.defenseCounter}</p>

              </>}
              {this.props.deflect && <>
              <div className="opponent__effectBoxes">
                <h3 style={{backgroundColor: '#FFA061'}}>Def</h3>
                <p style={{color: '#FFA061'}}>{this.props.deflectDmg}</p>
              </div>
              <p className="opponent__counter" style={{backgroundColor: '#FFA061'}}>{this.props.deflectCounter}</p>

              </>}
          </div>

          {this.props.impact &&
            <>
          <div className="attack__impact">
            <h1 style={{ color: this.props.impactType === "gain" ? "green" : "red" }}>{this.props.impactAmount}</h1>
          </div>
          </>
        }
        {this.props.info && 
          <>
          <div>
            <div className="opponent__attackInfo">
              <div className="actionbox__attackTitle">
                    <h3>{this.props.attacks[this.props.num]}</h3>
                    <p>({this.props.types[this.props.num]})</p>
                  </div>
                  <div className="actionbox__attackDescription">
                    <p>{this.props.description[this.props.num]}</p>
                  </div>
                  <div className="actionbox__statLine">
                    <div className="actionbox__chanceInfo">
                      <h3>Dmg</h3>
                      <p>{this.props.damage[this.props.num]}</p>
                    </div>
                    <div className="actionbox__chanceImpact">
                      <h3>Man</h3>
                      <p>{this.props.manaCost[this.props.num]}</p>
                    </div>
                    <div className="actionbox__chanceInfo">
                      <h3>Crit Chance</h3>
                      <p>{this.props.critChance[this.props.num]}%</p>
                    </div>
                    <div className="actionbox__chanceImpact">
                      <h3>Crit Dmg</h3>
                      <p>{this.props.critDamage[this.props.num]}%</p>
                    </div>
                  </div>
            </div>
          </div>
          </>
        }
        </div>
        <div className="opponent__imageContainer">
          <img className={(this.props.wobble && "wobble")} src={this.props.image} alt="opponent"/>
        </div>
      </div>
    </>
    )
}
}

export default Opponent;