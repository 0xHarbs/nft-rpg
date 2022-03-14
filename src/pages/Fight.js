import React, {Component} from "react"
import Opponent from "../components/Opponent"
import Fighter from "../components/Fighter"
import ActionBox from "../components/ActionBox"
import "../components/FightPage.css"
import {connectWallet, loadBlockchainData} from '../components/Methods'

class Fight extends Component {

  async componentDidMount() {
    let account = await connectWallet()
    let wilderland = await loadBlockchainData()
    this.setState({account})
    this.setState({wilderland})
    await this.getCharacter(0)
    await this.getOpponent(Math.floor(Math.random() * 4))
    await this.getAttacks()
    await this.getOpponentAttacks()
    await this.checkSpeed()
  }
      

    getCharacter = async (id) => {
    	const characterId = await this.state.wilderland.methods.ownerCharacterIds(this.state.account, id).call()
    	this.setState({characterId: characterId.toNumber() - 1})
      console.log("Character Id is", this.state.characterId)
    	const characterInfo = await this.state.wilderland.methods.characters(this.state.characterId).call()
    	
    	await this.setState({fighterName: characterInfo.name.toString()})
    	await this.setState({fighterHp: characterInfo.hp.toNumber()})
    	await this.setState({fighterLvl: characterInfo.level.toNumber()})
    	await this.setState({fighterMana: characterInfo.mana.toNumber()})
      await this.setState({fighterSpeed: characterInfo.speed.toNumber()})
      await this.setState({fighterSpeedCounter: characterInfo.speed.toNumber()})
    	await this.setState({fighterManaRegen: characterInfo.manaRegen.toNumber()})
      let imageId = characterInfo.baseId.toNumber() - 1
    	await this.setState({fighterImage: this.state.imageUrls[imageId]})
    	await this.setState({fighterTotalHp: characterInfo.hp.toNumber()})
    	await this.setState({fighterTotalMana: characterInfo.mana.toNumber()})
    	this.setState({fighterXp: characterInfo.xp.toNumber()})
  	}

  	getOpponent = async(id) => {
  		this.setState({opponentId: id})
    	const opponentInfo = await this.state.wilderland.methods.characters(id).call()
    	this.setState({opponentName: opponentInfo.name.toString()})
    	this.setState({opponentHp: opponentInfo.hp.toNumber()})
    	this.setState({opponentLvl: opponentInfo.level.toNumber()})
    	this.setState({opponentMana: opponentInfo.mana.toNumber()})
    	this.setState({opponentManaRegen: opponentInfo.manaRegen.toNumber()})
      this.setState({opponentSpeed: opponentInfo.speed.toNumber()})
      this.setState({opponentSpeedCounter: opponentInfo.speed.toNumber()})
    	this.setState({opponentImage: this.state.imageUrls[id]})

    	this.setState({opponentTotalHp: opponentInfo.hp.toNumber()})
    	this.setState({opponentTotalMana: opponentInfo.mana.toNumber()})
  	}

  	getAttacks = async () => {
  		let attack = await this.state.wilderland.methods.characterToAttack(this.state.characterId, 0).call()
      this.setState({fighterAttackName: [attack.name]})
  		this.setState({fighterManaCost: [attack.manaCost.toNumber()]})
  		this.setState({fighterAttackDamage: [attack.attackDamage.toNumber()]})
  		this.setState({fighterCritChance: [attack.critChance.toNumber()]})
  		this.setState({fighterCritDamage: [attack.critDamage.toNumber()]})
  		this.setState({fighterAttackType: [attack.attackType]})
      this.setState({fighterAttackDescription: [attack.description]})
  		for(let i = 1; i < 4; i++) {
  			attack = await this.state.wilderland.methods.characterToAttack(this.state.characterId, i).call()
  			this.setState(prevState => ({
  				fighterAttackName: [...prevState.fighterAttackName, attack.name]
  			}))
  			this.setState(prevState => ({
  				fighterManaCost: [...prevState.fighterManaCost, attack.manaCost.toNumber()]
  			}))
  			this.setState(prevState => ({
  				fighterAttackDamage: [...prevState.fighterAttackDamage, attack.attackDamage.toNumber()]
  			}))
  			this.setState(prevState => ({
  				fighterCritChance: [...prevState.fighterCritChance, attack.critChance.toNumber()]
  			}))
  			this.setState(prevState => ({
  				fighterCritDamage: [...prevState.fighterCritDamage, attack.critDamage.toNumber()]
  			}))
  			this.setState(prevState => ({
  				fighterAttackType: [...prevState.fighterAttackType, attack.attackType]
  			}))
        this.setState(prevState => ({
          fighterAttackDescription: [...prevState.fighterAttackDescription, attack.description]
        }))
  		}
  		console.log(this.state.fighterAttackType)
  		console.log(this.state.fighterAttackName)
  	}

  	getOpponentAttacks = async () => {
  		let opponentId = this.state.opponentId
  		let attack = await this.state.wilderland.methods.characterToAttack(opponentId, 0).call()
  		this.setState({opponentAttackName: [attack.name]})
  		this.setState({opponentManaCost: [attack.manaCost.toNumber()]})
  		this.setState({opponentAttackDamage: [attack.attackDamage.toNumber()]})
  		this.setState({opponentCritChance: [attack.critChance.toNumber()]})
  		this.setState({opponentCritDamage: [attack.critDamage.toNumber()]})
  		this.setState({opponentAttackType: [attack.attackType]})
      this.setState({opponentAttackDescription: [attack.description]})
  		for(let i = 1; i < 4; i++) {
  			attack = await this.state.wilderland.methods.characterToAttack(opponentId, i).call()
  			this.setState(prevState => ({
  				opponentAttackName: [...prevState.opponentAttackName, attack.name]
  			}))
  			this.setState(prevState => ({
  				opponentManaCost: [...prevState.opponentManaCost, attack.manaCost.toNumber()]
  			}))
  			this.setState(prevState => ({
  				opponentAttackDamage: [...prevState.opponentAttackDamage, attack.attackDamage.toNumber()]
  			}))
  			this.setState(prevState => ({
  				opponentCritChance: [...prevState.opponentCritChance, attack.critChance.toNumber()]
  			}))
  			this.setState(prevState => ({
  				opponentCritDamage: [...prevState.opponentCritDamage, attack.critDamage.toNumber()]
  			}))
  			this.setState(prevState => ({
  				opponentAttackType: [...prevState.opponentAttackType, attack.attackType]
  			}))
        this.setState(prevState => ({
          opponentAttackDescription: [...prevState.opponentAttackDescription, attack.description]
        }))
  		}
  		console.log(this.state.opponentAttackType)
  		console.log(this.state.opponentAttackName)
  	}

    checkSpeed = async () => {
      console.log("Opponent speed", this.state.opponentSpeed)
      console.log("User speed", this.state.fighterSpeed)
      if (this.state.opponentSpeed > this.state.fighterSpeed) {
        await this.setState({actionText: "Your opponent starts!"})
        await this.setState({attacker: "opponent"})
        await this.setState({receiver: "fighter"})
 
        let attackId = Math.floor(Math.random() * 3)
        let type = this.state.opponentAttackType[attackId] 
        console.log("Opponent attack type is", type)
        this.opponentTurnDelays(attackId)
        
        setTimeout( async () => {await this.router(type, attackId)}, 4500)
      }
    }

  	endGame = async(loser) => {
      if (loser === "opponent") {
        alert("Game is over! You won")
        await this.state.wilderland.methods.playerWins(0, 30).send({from: this.state.account})
      } else {
        alert("Game is over! You lost...")
      }
  	}

  	router = async(type, attackId) => {
  		let attacker = this.state.attacker
  		let receiver = this.state.receiver
      let damage = this.state[attacker + "AttackDamage"][attackId]
      let cost = this.state[attacker + "ManaCost"][attackId]
      let critChance = this.state[attacker + "CritChance"][attackId]
      let critDamage = this.state[attacker + "CritDamage"][attackId]
      let [costTarget, damageTarget, gainTarget, gainType, certainty] = await this.attackCompiler(type, attackId)
      console.log("Cost target is: " + costTarget + ". Damage target is: " + damageTarget + ". Gain target is: " + gainTarget + ". Gain type is: " + gainType)

      if (type === "Normal" || type === "Mana Damage" || type === "Double Strike") {
        damage = await this.checkBlocks(damageTarget, receiver, attacker, damage)
        await this.damage(attacker, receiver, damage, cost, damageTarget, costTarget)
        if (type === "Double Strike") { 
          this.updatePercent()
          await this.damage(attacker, receiver, damage, 0, damageTarget, costTarget)
        }
  		} else if (type === "Lifelink" || type === "Manalink") {
        damage = await this.checkBlocks(damageTarget, receiver, attacker, damage)
        await this.damageAndGain(attacker, receiver, damage, cost, damageTarget, costTarget)
      } else if (type === "Heal" || type === "Mana Regen") {
  			await this.gain(attacker, damage, cost, costTarget, gainTarget, gainType) 
  		} else if (type === "Leech" || type === "Suffer" || type === "Sleep" || type === "Poison" || type === "Bleed" || type === "Freeze" || type === "Burn") {
        await this.recurringDamage(type, attacker, receiver, damage, damageTarget, gainTarget, gainType, certainty, critChance, critDamage)
        damage = await this.checkBlocks(damageTarget, receiver, attacker, damage)
        await this.damage(attacker, receiver, damage, cost, damageTarget, costTarget)
      } else if (type === "Defense" || type === "Deflect" || type === "Mana Defense") {
        type = type.replaceAll(" ", "")
        await this.damageReduction(type, attacker, receiver, damage, cost, costTarget, critDamage)
      } else if (type === "Buff") {
        await this.buffStats(type, attacker, receiver, damage, cost, costTarget, critDamage)
      }else {
  			console.log("Unknown")
  		}

      this.applyCounterEffects(receiver, attacker, damageTarget)
      this.triggerImpact(attacker, receiver, damage, damageTarget, gainTarget, type)
      this.updatePercent(receiver, attacker)
      this.checkHp(receiver, attacker)
      await this.manaRegen(receiver)
      this.speedCounter(attacker, receiver)
      setTimeout(() => this.resetAnimation(attacker, receiver),2000)
      
      let skipResult;
      let skipManaTooLow;
      let turnTaker;
      let text;
      let hpRegen;
      let effectApplied = false;
      let gain = false;
      attackId = Math.floor(Math.random() * 3)
      type = this.state.opponentAttackType[attackId]

      setTimeout( async () => {
        [effectApplied, damage, hpRegen, gain] = await this.applyRecurringEffects(attacker, receiver)
        if (effectApplied) {
          this.updatePercent(receiver, attacker)
          this.triggerImpact(receiver, attacker, damage, damageTarget, gainTarget, type)
          this.triggerCounterGain(attacker, receiver, hpRegen, damageTarget, gainTarget, type)
      }}, 2500)
      
      setTimeout( () => this.resetAnimation(attacker, receiver), 4000)

      if(this.state[receiver + "Sleep"] === false) {
        skipResult = await this.checkMana(receiver)
        skipManaTooLow = await this.checkMana(attacker)
        attackId = await this.checkAttackOptions(attackId, receiver)
        if (skipResult === true && receiver === "fighter" && skipManaTooLow === false) {
          skipResult = await this.checkMana(attacker)
          await this.router(type, attackId)
          this.setState({actionText: ["It's your opponents turn again."]})
        } else if (skipResult === true && skipManaTooLow === false) {
          this.setState({actionText: ["It's your turn again."]})
        } else if (skipResult === true) {
          this.manaRegen(attacker)
          this.manaRegen(receiver)
        } else {
          await this.finishTurn(receiver, attacker)
          if (this.state.receiver === "fighter") {
            this.opponentTurnDelays(attackId)
            setTimeout( async () => await this.router(type, attackId), 8000)
            }
        }
      } else if (this.state[receiver + "Sleep"] === true && receiver === "fighter") {
        text = ("It's your opponents turn again! Opponent used " + this.state.opponentAttackName[attackId] + ". Attack type is " + this.state.opponentAttackType[attackId] + " with " + this.state.opponentAttackDamage[attackId] + " impact.")
        this.setState({opponentAttackId: attackId})
        setTimeout( async() => this.setState({yourTurn: false}), 250)
        setTimeout( async() => this.setState({actionText: text}), 2000)
        setTimeout( async() => this.setState({opponentInfo: true}), 5000)
        setTimeout( async () => {
        await this.router(type, attackId)
        await this.setState({yourTurn: true})
        await this.setState({opponentInfo: false})}, 10000)
      } else if (this.state[receiver + "Sleep"] === true & receiver === "opponent") {
        text = "It's still your turn."
        setTimeout( async() => this.setState({actionText: text}), 2000)
      }
      this.setState({counter: this.state.counter + 1})
  	}

    attackCompiler = async(type, attackId) => {
      let damageTarget;
      let costTarget;
      let gainTarget;
      let gainType;
      let certainty;

      if(type === "Normal" || type === "Double Strike" || type === "Lifelink" || type === "Leech" || type === "Heal" || type === "Bleed" || type === "Deflect" || type === "Defense") {
        damageTarget = "Hp"
        costTarget = "Mana"
        gainTarget = "Hp"
        gainType = "Rejuvenate"
        certainty = true
      }
      else if (type === "Mana Damage" || type === "Manalink" || type === "Suffer" || type === "Freeze" || type === "Mana Regen" || type === "Mana Defense") {
        damageTarget = "Mana"
        costTarget = "Mana"
        gainTarget = "Mana"
        gainType = "Rejuvenate"
        certainty = true
      } else if (type === "Sleep" || type === "Poison" || type === "Burn" || type === "Plague") {
        damageTarget = "Hp"
        costTarget = "Mana"
        certainty = false
      }
      return[costTarget, damageTarget, gainTarget, gainType, certainty]
    }


    damage = async(attacker, receiver, damage, cost, damageTarget, costTarget) => {
      await this.setState({[attacker + costTarget]: this.state[attacker + costTarget] - cost})
      await this.setState({[receiver + damageTarget]: this.state[receiver + damageTarget] - damage })
    }


    damageAndGain = async(attacker, receiver, damage, cost, damageTarget, costTarget, gainTarget) => {
      await this.setState({[attacker + costTarget]: this.state[attacker + costTarget] - cost})
      await this.setState({[receiver + damageTarget]: this.state[receiver + damageTarget] - damage })
      await this.setState({[attacker + gainTarget]: this.state[attacker + gainTarget] + damage})
    }


    gain = async(attacker, damage, cost, costTarget, gainTarget, gainType) => {
      await this.setState({[attacker + costTarget]: this.state[attacker + costTarget] - cost})
      if (gainType === "Rejuvenate") {
        if (this.state[attacker + gainTarget] + damage > this.state[attacker + "Total" + gainTarget]) {
          await this.setState({[attacker + gainTarget]: this.state[attacker + "Total" + gainTarget] })
        } else {
          await this.setState({[attacker + gainTarget]: this.state[attacker + gainTarget] + damage})
        } 
      }
    }


    recurringDamage = async(type, attacker, receiver, damage, damageTarget, gainTarget, gainType, certainty, critChance, counter) => {
      let randNum = Math.floor(Math.random() * 100)
      console.log("Sent to recurring damage with attack type: " + type + ". Certainty is: " + certainty)
      if (certainty === true) {
        await this.setState({[receiver + type]: true})
        await this.setState({[receiver + type + "Counter"]: counter})
        await this.setState({[receiver + type + "Damage"]: damage})
      } else if (certainty === false) {
        console.log("Got rand num in recurring: " + randNum + ". Combined string is: " + receiver + type)
        if (randNum < critChance) {
          await this.setState({[receiver + type]: true})
          await this.setState({[receiver + type + "Counter"]: counter})
          await this.setState({[receiver + type + "Damage"]: damage})
          console.log("Completed actions with receiver of: " + receiver + ". State is: " + this.state[receiver + type])
        }
      }
    }


    damageReduction = async (type, attacker, receiver, damage, cost, costTarget, counter) => {
      await this.setState({[attacker + costTarget]: this.state[attacker + costTarget] - cost})
      await this.setState({[attacker + type]: true})
      await this.setState({[attacker + type + "Counter"]: counter})
      await this.setState({[attacker + type + "Damage"]: damage})
      console.log("Reduction - The state is: " + [attacker + type] + ". The status is: " + this.state[attacker + type])
    }

    buffStats = async (type, attacker, receiver, damage, cost, costTarget, critDamage) => {
      if (type === "Buff") {
        let attacks = [...this.state[attacker + "AttackDamage"]]
        for (let i = 0; i < 8; i++) {
          let attack = attacks[i]
          attack = attacks[i] + damage
          attacks[i] = attack
        }
        this.setState({[attacker + "AttackDamage"]: attacks})
        this.setState({[attacker + type]: true})
        this.setState({[attacker + type + "Damage"]: damage})
        this.setState({[attacker + type + "Counter"]: 2})
        }
    }


    updatePercent = async(receiver, attacker) => {
      await this.setState({[attacker + "ManaPercent"]: ((this.state[attacker + "Mana"] / this.state[attacker + "TotalMana"]) * 100).toFixed(2) + '%' })
      await this.setState({[attacker + "HpPercent"]: ((this.state[attacker + "Hp"] / this.state[attacker + "TotalHp"]) * 100).toFixed(2) + '%' })
      await this.setState({[receiver + "ManaPercent"]: ((this.state[receiver + "Mana"] / this.state[receiver + "TotalMana"]) * 100).toFixed(2) + '%' })
      await this.setState({[receiver + "HpPercent"]: ((this.state[receiver + "Hp"] / this.state[receiver + "TotalHp"]) * 100).toFixed(2) + '%'}) 
    }


    triggerImpact = async(attacker, receiver, damage, damageTarget, gainTarget, type) => {
      if (type === "Heal" || type === "Defense" || type === "Deflect" || type === "Mana Regen" || type === "Buff") {
        this.setState({[attacker + "Impact"]: true})
        this.setState({[attacker + "ImpactAmount"]: "+ " + damage})
        this.setState({[attacker + "ImpactType"]: "gain"})
      } else {
        this.setState({[receiver + "Impact"]: true})
        this.setState({[receiver + "ImpactAmount"]: "- " + damage})
        this.setState({[receiver + "Wobble"]: true})
      }
    }

    triggerCounterGain = async(attacker, receiver, damage, damageTarget, gainTarget, type) => {
      if (damage > 0) {
        this.setState({[receiver + "Impact"]: true})
        this.setState({[receiver + "ImpactAmount"]: "+ " + damage})
        this.setState({[receiver + "ImpactType"]: "gain"})
      }
    }

    resetAnimation = async(attacker, receiver) => {
        this.setState({[receiver + "Wobble"]: false})
        this.setState({[receiver + "Impact"]: false})
        this.setState({[receiver + "ImpactType"]: null})
        this.setState({[attacker + "Wobble"]: false})
        this.setState({[attacker + "Impact"]: false})
        this.setState({[attacker + "ImpactType"]: null})
    }


    manaRegen = async(receiver) => {
      if(this.state[receiver + "Mana"] < this.state[receiver + "TotalMana"] && this.state.counter > 5) {
        if(this.state[receiver + "Mana"] + this.state[receiver + "ManaRegen"] > this.state[receiver + "TotalMana"]) {
          await this.setState({[receiver + "Mana"]: this.state[receiver + "TotalMana"]})
        } else {
          await this.setState({[receiver + "Mana"]: this.state[receiver + "Mana"] + this.state[receiver + "ManaRegen"]})
        } 
      }
    }


    checkBlocks = async(damageTarget, receiver, attacker, damage) => {
      if (damageTarget === "Mana") {
        if (this.state[receiver + "ManaDefense"] === true) {
          damage = damage - this.state[receiver + "ManaDefenseDamage"]
        }
      } else if (damageTarget === "Hp") {
        if (this.state[receiver + "Defense"] === true) {
          damage = damage - this.state[receiver + "DefenseDamage"]
        }
      }
      if (damage < 0 ) {
        return 0
      } else {
          return damage
      }
    }


    checkMana = async(receiver) => {
      const lowestManaCost = Math.min(...this.state[receiver + "ManaCost"])
      if(this.state[receiver + "Mana"] < lowestManaCost) { 
        return true
      } else {
        return false
      }
    }


    checkHp = async(receiver, attacker) => {
      if(this.state[receiver + "Hp"] <= 0) {
        this.setState({gameOver: true})
        this.endGame(receiver)
      } else if (this.state[attacker + "Hp"] <= 0) {
        this.setState({gameOver: true})
        this.endGame(attacker)
      }
    }


    checkAttackOptions = async(attackId, receiver) => {
      let highestManaCost = Math.max(...this.state[receiver + "ManaCost"])
      let i;
      let manaCost;
      let ids = []
      if(this.state[receiver + "Mana"] < highestManaCost) {
        for (i = 0; i < 4; i++) {
          manaCost = this.state[receiver + "ManaCost"][i]
          console.log("Mana cost is: " + manaCost + ". Current mana is: " + this.state[receiver + "Mana"])
          if (manaCost < this.state[receiver + "Mana"]) {
            console.log("Id pushed", i)
            ids.push(i)
          }
        }
        let randNum = Math.floor(Math.random() * ids.length)
        attackId = ids[randNum]
        console.log("Id got after filter is: ", attackId)
      }
      console.log("Receiver attacks available are: ", ids)
      return attackId
    }


    applyCounterEffects = async(receiver, attacker, damageTarget) => {
      if(this.state[receiver + "DeflectCounter"] > 0 && damageTarget === "Hp") {
        console.log("Deflect counter triggers")
        await this.setState({[attacker + "Hp"]: this.state[attacker + "Hp"] - this.state[receiver + "DeflectDamage"]})
        await this.setState({[receiver + "DeflectCounter"]: this.state[receiver + "DeflectCounter"] - 1})
        if (this.state[receiver + "DeflectCounter"] === 0) {
          this.setState({[receiver + "Deflect"]: false})
        }
      }
      if(this.state[receiver + "DefenseCounter"] > 0) {
        console.log("Defense counter triggers")
        await this.setState({[receiver + "DefenseCounter"]: this.state[receiver + "DefenseCounter"] - 1})
        if (this.state[receiver + "DefenseCounter"] === 0) {
          this.setState({[receiver + "Defense"]: false})
        }
      }
    }


    applyRecurringEffects = async(attacker, receiver) => {
      let effectApplied = false;
      let attackerHpBefore = this.state[attacker + "Hp"]
      let receiverHpBefore = this.state[receiver + "Hp"]
      let damage = 0;
      let hpRegen = 0;
      let gain = false;
      if (this.state[attacker + "Poison"] === true) {
        this.setState({[attacker + "Hp"]: this.state[attacker + "Hp"] - this.state[attacker + "PoisonDamage"]})
        this.setState({[attacker + "PoisonCounter"]: this.state[attacker + "PoisonCounter"] - 1})
        effectApplied = true;
        if (this.state[attacker + "PoisonCounter"] === 0) {
          this.setState({[attacker + "Poison"]: false})
        }
      }

      if (this.state[attacker + "Leech"] === true) {
        this.setState({[attacker + "Hp"]: this.state[attacker + "Hp"] - this.state[attacker + "LeechDamage"]})
        if (this.state[receiver + "Hp"] + this.state[attacker + "LeechDamage"] > this.state[receiver + "TotalHp"]) {
          this.setState({[receiver + "Hp"]: this.state[receiver + "TotalHp"] })
        } else {
          this.setState({[receiver + "Hp"]: this.state[receiver + "Hp"] + this.state[attacker + "LeechDamage"] })
          this.setState({[attacker + "LeechCounter"]: this.state[attacker + "LeechCounter"] - 1})
        }
        gain = true;
        effectApplied = true;
        if(this.state[attacker + "LeechCounter"] === 0) {
          this.setState({[attacker + "Leech"]: false})
        }
      }

      if(this.state[receiver + "Sleep"] === true) {
        this.setState({[receiver + "SleepCounter"]: this.state[receiver + "SleepCounter"] -1 })
        if(this.state[receiver + "SleepCounter"] === 0) {
          this.setState({[receiver + "Sleep"]: false})
        }
      }

      if(this.state[receiver + "Buff"] === true) {
        this.setState({[receiver + "BuffCounter"]: this.state[receiver + "BuffCounter"] -1 })
        if(this.state[receiver + "BuffCounter"] === 0) {
          this.setState({[receiver + "Buff"]: false})
          let buffDamage = this.state[receiver + "BuffDamage"]
          let attacks = [...this.state[receiver + "AttackDamage"]]
          for (let i = 0; i < 8; i++) {
            let attack = attacks[i]
            attack = attacks[i] - buffDamage
            attacks[i] = attack
          }
          this.setState({[receiver + "AttackDamage"]: attacks})
        }
      }

      let attackerHpAfter = this.state[attacker + "Hp"]
      let receiverHpAfter = this.state[receiver + "Hp"]
      damage = attackerHpBefore - attackerHpAfter
      hpRegen = receiverHpAfter - receiverHpBefore 
      return [effectApplied, damage, hpRegen, gain]
    }


    speedCounter = async(attacker) => {
      this.setState({[attacker + "SpeedCounter"]: this.state[attacker + "SpeedCounter"] + this.state[attacker + "Speed"] })
    }


    finishTurn = async (receiver, attacker) => {
      if (attacker === "opponent") {
        await this.setState({actionText: "Opponent has finished attacking."})
        await this.setState({attacker: "fighter"})
        await this.setState({receiver: "opponent"})
        setTimeout( () => this.setState({actionText: "It's your turn."}), 2000)
      } else {
        await this.setState({actionText: "Your turn has finished!"})
        await this.setState({attacker: "opponent"})
        await this.setState({receiver: "fighter"})
      }
    }

    opponentTurnDelays = async(attackId) => {
      let text;
      this.setState({opponentAttackId: attackId})
      setTimeout( async() => this.setState({yourTurn: false}), 250)
      setTimeout( async() => {
        text = ("Opponent used " + this.state.opponentAttackName[attackId] + ". Attack type is " + this.state.opponentAttackType[attackId] + " with " + this.state.opponentAttackDamage[attackId] + " impact.")
        this.setState({actionText: text})
      }, 2000)
      setTimeout( async() => this.setState({opponentInfo: true}), 3750)
      setTimeout( async () => {
        await this.setState({yourTurn: true})
        await this.setState({opponentInfo: false})}, 10000)
    }

    

	constructor(props) {
		super(props)
		this.state = {
			account: "",
			attacker: "fighter",
			receiver: "opponent",
			wilderland: {},
			actionText: "What will you do next?",
			fighterHp: 150,
			fighterLvl: 11,
			fighterAttack: 50,
			fighterAttacks: ["Slash", "Slam", "Charge", "Roar"],
			fighterMana: 200,
			fighterManaCost: 60,
			fighterHpPercent: '100%',
			fighterManaPercent: '100%',
			fighterPoison: false,
			fighterSleep: false,
      fighterLeech: false,
			fighterAttackName: [],
			fighterAttackType: [],
      fighterAttackDamage: [],
      fighterAttackDescription: [],
      fighterCritDamage: [],
      fighterCritChance: [],
      fighterManaCost: [],
      fighterSpeedCounter: 0,
      fighterWobble: false,
			opponentHp: 180,
			opponentLvl: 11,
			opponentAttack: 45,
			opponentMana: 170,
			opponentManaCost: 30,
			opponentHpPercent: '100%',
			opponentManaPercent: '100%',
			opponentPoison: false,
      opponentPoisonCounter: 0,
      opponentPoisonDamage: 0,
			opponentSleep: false,
      opponentSleepCounter: 0,
      opponentLeech: false,
      opponentSpeedCounter: 0,
      opponentImpact: false,
      opponentImpactAmount: 0,
      opponentWobble: false,
      opponentInfo: false,
      opponentAttackName: [],
      opponentAttackType: [],
      opponentAttackDamage: [],
      opponentAttackDescription: [],
      opponentCritDamage: [],
      opponentCritChance: [],
      opponentManaCost: [],
      opponentAttackId: 0,
			counter: 1,
      gameOver: false,
			loading: true,
      yourTurn: true,
			imageUrls: [
			"https://i.pinimg.com/564x/6a/9a/33/6a9a3317db3c8a379596f4c292193a7d.jpg",
			"https://i.pinimg.com/564x/9e/ce/c5/9ecec5acdbb4f14a9f7853773fec68f0.jpg",
			"https://i.pinimg.com/564x/76/a1/39/76a139c7c8e67fc5ecf39b856eeffd33.jpg",
			"https://i.pinimg.com/564x/a1/67/6c/a1676c99fdef16a67ffa5a4e16afd9d7.jpg",
			"https://i.pinimg.com/564x/1f/8e/73/1f8e73890bffe4281adc3a76cbb33295.jpg"
			]
		}
	}

	render() {
		return(
			<div className="fight__page">
				<Opponent 
				name={this.state.opponentName}
				hp={this.state.opponentHp}
				totalHp={this.state.opponentTotalHp}
				mana={this.state.opponentMana}
				totalMana={this.state.opponentTotalMana}
				attack={this.state.opponentAttack}
				level={this.state.opponentLvl}
				image={this.state.opponentImage}
				hpPercent={this.state.opponentHpPercent}
				manaPercent={this.state.opponentManaPercent}
				poison={this.state.opponentPoison}
				sleep={this.state.opponentSleep}
        leech={this.state.opponentLeech}
        defense={this.state.opponentDefense}
        deflect={this.state.opponentDeflect}
        impact={this.state.opponentImpact}
        impactAmount={this.state.opponentImpactAmount}
        impactType={this.state.opponentImpactType}
        damageType={this.state.damageType}
        poisonCounter={this.state.opponentPoisonCounter}
        poisonDmg={this.state.opponentPoisonDamage}
        leechCounter={this.state.opponentLeechCounter}
        leechDmg={this.state.opponentLeechDamage}
        sleepCounter={this.state.opponentSleepCounter}
        defenseDmg={this.state.opponentDefenseDamage}
        defenseCounter={this.state.opponentDefenseCounter}
        deflectDmg={this.state.opponentDeflectDamage}
        deflectCounter={this.state.opponentDeflectCounter}
        wobble={this.state.opponentWobble}
        info={this.state.opponentInfo}
        attacks={this.state.opponentAttackName}
        damage={this.state.opponentAttackDamage}
        description={this.state.opponentAttackDescription}
        manaCost={this.state.opponentManaCost}
        critChance={this.state.opponentCritChance}
        critDamage={this.state.opponentCritDamage}
        types={this.state.opponentAttackType}
        num={this.state.opponentAttackId}
				/>
				<Fighter 
				name={this.state.fighterName}
				hp={this.state.fighterHp}
				totalHp={this.state.fighterTotalHp}
				fighterMana={this.state.fighterMana}
				fighterTotalMana={this.state.fighterTotalMana}
				attack={this.state.fighterAttack}
				level={this.state.fighterLvl}
				image={this.state.fighterImage}
				fighterHpPercent={this.state.fighterHpPercent}
				fighterManaPercent={this.state.fighterManaPercent}
				poison={this.state.fighterPoison}
				sleep={this.state.fighterSleep}
        leech={this.state.fighterLeech}
        defense={this.state.fighterDefense}
        manaDefense={this.state.fighterManaDefense}
        buff={this.state.fighterBuff}
        deflect={this.state.fighterDeflect}
        impact={this.state.fighterImpact}
        impactAmount={this.state.fighterImpactAmount}
        impactType={this.state.fighterImpactType}
        poisonCounter={this.state.fighterPoisonCounter}
        poisonDmg={this.state.fighterPoisonDamage}
        leechCounter={this.state.fighterLeechCounter}
        leechDmg={this.state.fighterLeechDamage}
        sleepCounter={this.state.fighterSleepCounter}
        defenseDmg={this.state.fighterDefenseDamage}
        defenseCounter={this.state.fighterDefenseCounter}
        manaDefenseDmg={this.state.fighterManaDefenseDamage}
        manaDefenseCounter={this.state.fighterManaDefenseCounter}
        deflectDmg={this.state.fighterDeflectDamage}
        deflectCounter={this.state.fighterDeflectCounter}
        buffCounter={this.state.fighterBuffCounter}
        buffDmg={this.state.fighterBuffDamage}
        wobble={this.state.fighterWobble}
				/>
				<ActionBox 
				actionText={this.state.actionText}
				attacks={this.state.fighterAttackName}
        damage={this.state.fighterAttackDamage}
        description={this.state.fighterAttackDescription}
        manaCost={this.state.fighterManaCost}
        critChance={this.state.fighterCritChance}
        critDamage={this.state.fighterCritDamage}
				types={this.state.fighterAttackType}
				attackOpponent={this.attackOpponent}
				router={this.router}
        finishTurn={this.finishTurn}
        opponentTurn={this.opponentTurnDelays}
        manaRegen={this.manaRegen}
        checkMana={this.checkMana}
				round={this.state.counter}
				skip={this.state.skipTurn}
        yourTurn={this.state.yourTurn}
        opponentTypes={this.state.opponentAttackType}
				/>
			</div>
		)
	}	
}

export default Fight;
	