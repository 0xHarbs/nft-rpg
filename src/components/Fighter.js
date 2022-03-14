import './Fighter.css';
import React, {Component} from 'react';
import './Button.css'

class Fighter extends Component{

  render() {
  return(
    <>
    <audio id="my_audio" src="bg.mp3" loop="loop"></audio>
      <div id="overlay" className="fighter">
      <div className="fighter__imageContainer">
            <img className={(this.props.wobble && "wobble")} src={this.props.image} alt="fighter"/>
          </div>
        <div className="fighter__container">
          <div className="fighter__textInfo">
            <div className="fighter__textTop">
              <div className="fighter__textLeft">
                <h3>{this.props.name}</h3>
                <p>Lvl {this.props.level}</p>
              </div>
              <div className="fighter__textRight">
                <div className="fighter__data">
                  <p><strong>HP</strong> | {this.props.hp} / {this.props.totalHp}</p>
                  <p><strong>Mana</strong> | {this.props.fighterMana} / {this.props.fighterTotalMana}</p>
                </div>
              </div>
            </div>
            <div className="fighter__hp">
              <div className="fighter__hpBar" style={{width: this.props.fighterHpPercent}}>
              </div>
            </div>
            <div className="fighter__mana">
              <div className="fighter__manaBar"  style={{width: this.props.fighterManaPercent}}>
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
              {this.props.manaDefense && <>
              <div className="opponent__effectBoxes">
                <h3 style={{backgroundColor: '#952BFF'}}>Mdf</h3>
                <p style={{color: '#952BFF'}}>{this.props.manaDefenseDmg}</p>
              </div>
              <p className="opponent__counter" style={{backgroundColor: '#952BFF'}}>{this.props.manaDefenseCounter}</p>

              </>}
              {this.props.buff && <>
              <div className="opponent__effectBoxes">
                <h3 style={{backgroundColor: '#B4E3ED'}}>Buf</h3>
                <p style={{color: '#B4E3ED'}}>{this.props.buffDmg}</p>
              </div>
              <p className="opponent__counter" style={{backgroundColor: '#B4E3ED'}}>{this.props.buffCounter}</p>

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
        </div>
      </div>
    </>
    )
}
}

export default Fighter;
