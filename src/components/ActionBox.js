import './ActionBox.css';
import React, {Component} from 'react';
import './Button.css'


class ActionBox extends Component{
  showText = async (number) => {
    this.setState({attackBrief: true})
    this.setState({num: number})
  }

  hideText = async () => {
    this.setState({attackBrief: false})
  }

  constructor(props) {
    super(props)
    this.state = {
      attackBrief: false,
      num: 0,
    }
  }

  render() {
  return(
      <div className="actionbox">
      {this.props.yourTurn ? <>
        <div className="actionbox__container">
          <div className="actionbox__textInfo">
            {this.state.attackBrief
              ? <>
                <div className="actionbox__attackTitle">
                  <h3>{this.props.attacks[this.state.num]}</h3>
                  <p>({this.props.types[this.state.num]})</p>
                </div>
                <div className="actionbox__attackDescription">
                  <p>{this.props.description[this.state.num]}</p>
                </div>
                <div className="actionbox__statLine">
                  <div className="actionbox__chanceInfo">
                  {this.props.types[this.state.num] === "Sleep" || this.props.types[this.state.num] === "Poison" 
                  ? <h3>Chance</h3>
                  : <h3>Crit Chance</h3>
                }
                    <p>{this.props.critChance[this.state.num]}%</p>
                  </div>
                  <div className="actionbox__chanceImpact">
                  {this.props.types[this.state.num] === "Sleep" || this.props.types[this.state.num] === "Poison" || this.props.types[this.state.num] === "Leech" || this.props.types[this.state.num] === "Deflect" || this.props.types[this.state.num] === "Defense" || this.props.types[this.state.num] === "Mana Defense" 
                  ? <>
                  <h3>Counters</h3>
                  <p>{this.props.critDamage[this.state.num]}</p>
                  </>
                  : <>
                  <h3>Crit Dmg</h3>
                  <p>{this.props.critDamage[this.state.num]}%</p>
                  </>
                }
                  </div>
                </div>
              </>
              : <> 
                  <p><strong>Round {this.props.round}</strong></p>
                  <p>{this.props.actionText}</p>
                  <button onClick={ async (e) => {
                    console.log("Button pressed")
                    let skipResult = await this.props.checkMana("opponent")
                    console.log(skipResult)
                    if (skipResult === false) {
                      let attackId = Math.floor(Math.random() * 3)
                      let type = this.props.opponentTypes[attackId]
                      await this.props.finishTurn("opponent", "fighter")
                      await this.props.manaRegen("opponent")
                      await this.props.opponentTurn(attackId)
                      setTimeout(async() => await this.props.router(type, attackId), 5000)
                    } else {
                      await this.props.manaRegen("opponent")
                      await this.props.manaRegen("fighter")
                    }
                  }}
                  >Skip Turn</button>
                </>
            }
          </div>
        </div>
        <div className="actionbox__moveContainer">
          <div className="actionbox__move">
            <div className="actionbox__moveButtons" 
            onClick={(e) => {
                  e.preventDefault()
                  this.props.router(this.props.types[0], 0)
                }}
            onMouseEnter={() => {
              this.showText(0)
            }}
            onMouseLeave={() => {
              this.hideText()
            }}
                >
              <div className="actionbox__text">
                <button>{this.props.attacks[0]}</button>
                <p>({this.props.types[0]})</p>
              </div>
              <div className="actionbox__attackStats">
                {this.props.types[0] === "Heal"
                ? <h3>Hel</h3>
                : <h3>Atk</h3>
              }
                <p>{this.props.damage[0]}</p>
              </div>
              <div className="actionbox__manaStats">
                <h3>Man</h3>
                <p>{this.props.manaCost[0]}</p>
              </div>
            </div>

            <div className="actionbox__moveButtons" 
            onClick={(e) => {
                    e.preventDefault()
                    this.props.router(this.props.types[1], 1)
                  }}
            onMouseEnter={() => {
              this.showText(1)
            }}
            onMouseLeave={() => {
              this.hideText()
            }}
                  >
              <div className="actionbox__text">
                  <button>{this.props.attacks[1]}</button>
                  <p>({this.props.types[1]})</p>
                </div>
              <div className="actionbox__attackStats">
                {this.props.types[1] === "Heal"
                ? <h3>Hel</h3>
                : <h3>Atk</h3>
              }
                <p>{this.props.damage[1]}</p>
              </div>
              <div className="actionbox__manaStats">
                <h3>Man</h3>
                <p>{this.props.manaCost[1]}</p>
              </div>
            </div>
          </div>

          <div className="actionbox__move">
            <div className="actionbox__moveButtons" 
            onClick={(e) => {
                  e.preventDefault()
                  this.props.router(this.props.types[2], 2)
                }}
            onMouseEnter={() => {
              this.showText(2)
            }}
            onMouseLeave={() => {
              this.hideText()
            }}
                >
              <div className="actionbox__text">
                <button>{this.props.attacks[2]}</button>
                <p>({this.props.types[2]})</p>
              </div>
              <div className="actionbox__attackStats">
                 {this.props.types[2] === "Heal"
                ? <h3>Hel</h3>
                : <h3>Atk</h3>
              }
                <p>{this.props.damage[2]}</p>
              </div>
              <div className="actionbox__manaStats">
                <h3>Man</h3>
                <p>{this.props.manaCost[2]}</p>
              </div>
            </div>

            <div className="actionbox__moveButtons" 
            onClick={(e) => {
                  e.preventDefault()
                  this.props.router(this.props.types[3], 3)
                }}
            onMouseEnter={() => {
              this.showText(3)
            }}
            onMouseLeave={() => {
              this.hideText()
            }}
                >
              <div className="actionbox__text">
                <button>{this.props.attacks[3]}</button>
                <p>({this.props.types[3]})</p>
              </div>
              <div className="actionbox__attackStats">
                 {this.props.types[3] === "Heal"
                ? <h3>Hel</h3>
                : <h3>Atk</h3>
              }
                <p>{this.props.damage[3]}</p>
              </div>
              <div className="actionbox__manaStats">
                <h3>Man</h3>
                <p>{this.props.manaCost[3]}</p>
              </div>
            </div>
          </div>
          <div className="actionbox__move">
            <div className="actionbox__moveButtons" 
            onClick={(e) => {
                  e.preventDefault()
                  this.props.router(this.props.types[4], 4)
                }}
            onMouseEnter={() => {
              this.showText(4)
            }}
            onMouseLeave={() => {
              this.hideText()
            }}
                >
              <div className="actionbox__text">
                <button>{this.props.attacks[4]}</button>
                <p>({this.props.types[4]})</p>
              </div>
              <div className="actionbox__attackStats">
                 {this.props.types[4] === "Heal"
                ? <h3>Hel</h3>
                : <h3>Atk</h3>
              }
                <p>{this.props.damage[4]}</p>
              </div>
              <div className="actionbox__manaStats">
                <h3>Man</h3>
                <p>{this.props.manaCost[4]}</p>
              </div>
            </div>

            <div className="actionbox__moveButtons" 
            onClick={(e) => {
                  e.preventDefault()
                  this.props.router(this.props.types[5], 5)
                }}
            onMouseEnter={() => {
              this.showText(5)
            }}
            onMouseLeave={() => {
              this.hideText()
            }}
                >
              <div className="actionbox__text">
                <button>{this.props.attacks[5]}</button>
                <p>({this.props.types[5]})</p>
              </div>
              <div className="actionbox__attackStats">
                 {this.props.types[5] === "Heal"
                ? <h3>Hel</h3>
                : <h3>Atk</h3>
              }
                <p>{this.props.damage[5]}</p>
              </div>
              <div className="actionbox__manaStats">
                <h3>Man</h3>
                <p>{this.props.manaCost[5]}</p>
              </div>
            </div>
          </div>
          <div className="actionbox__move">
            <div className="actionbox__moveButtons" 
            onClick={(e) => {
                  e.preventDefault()
                  this.props.router(this.props.types[6], 6)
                }}
            onMouseEnter={() => {
              this.showText(6)
            }}
            onMouseLeave={() => {
              this.hideText()
            }}
                >
              <div className="actionbox__text">
                <button>{this.props.attacks[6]}</button>
                <p>({this.props.types[6]})</p>
              </div>
              <div className="actionbox__attackStats">
                 {this.props.types[6] === "Heal"
                ? <h3>Hel</h3>
                : <h3>Atk</h3>
              }
                <p>{this.props.damage[6]}</p>
              </div>
              <div className="actionbox__manaStats">
                <h3>Man</h3>
                <p>{this.props.manaCost[6]}</p>
              </div>
            </div>

            <div className="actionbox__moveButtons" 
            onClick={(e) => {
                  e.preventDefault()
                  this.props.router(this.props.types[7], 7)
                }}
            onMouseEnter={() => {
              this.showText(7)
            }}
            onMouseLeave={() => {
              this.hideText()
            }}
                >
              <div className="actionbox__text">
                <button>{this.props.attacks[7]}</button>
                <p>({this.props.types[7]})</p>
              </div>
              <div className="actionbox__attackStats">
                 {this.props.types[7] === "Heal"
                ? <h3>Hel</h3>
                : <h3>Atk</h3>
              }
                <p>{this.props.damage[7]}</p>
              </div>
              <div className="actionbox__manaStats">
                <h3>Man</h3>
                <p>{this.props.manaCost[7]}</p>
              </div>
            </div>
          </div>
        </div>
        </>
        : <>
          <div className="actionbox__textInfo">
            <p>{this.props.actionText}</p>
          </div>
        </>
      }
      </div>
    )
}
}

export default ActionBox;