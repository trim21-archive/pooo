function parseSkillDamage (o) {
  let scenario = o.scenario
  let pos = scenario[0].pos
  let damage = 0
  for (let key of o.scenario) {
    damage = 0
    if (key.cmd === 'damage') {
      if (key.to === 'boss') {
        for (let tmp of key.list) {
          damage += parseInt(tmp.value)
        }
        break
      }
    }

    for (let key of o.scenario) {
      damage = 0
      if (key.cmd === 'loop_damage') {
        if (key.to === 'boss') {
          for (let tmp of key.list) {
            for (let t of tmp) {
              damage += parseInt(t.value)
            }
          }
        }
        break
      }
    }
  }
  return [{
    pos,
    damage
  }]
}

function parseAttackDamage (o) {
  let result = []
  let chargeAttackResult = []
  let pos = 0
  for (let key of o.scenario) {
    if (key.cmd === 'attack') {
      let damage = 0
      console.log(key.damage)
      for (let tmp in key.damage) {
        if (key.damage.hasOwnProperty(tmp)) {
          for (let t of key.damage[tmp]) {
            damage += parseInt(t.value)
          }
        }
      }
      result.push({
        pos: key.pos,
        damage
      })
    }

    if (key.cmd === 'special' || key.cmd === 'special_npc') {
      let damage = 0
      pos = key.pos
      for (let tmp of key.list) {
        for (let t of tmp.damage) {
          damage += parseInt(t.value)
        }
      }
      chargeAttackResult.push({
        pos: key.pos,
        damage
      })
    }
    if (key.cmd === 'chain_cutin') {
      continue
    }
    if (key.cmd === 'damage' && key.mode === 'parallel' && key.to === 'boss') {
      for (let tmp in chargeAttackResult) {
        if (chargeAttackResult.hasOwnProperty(tmp)) {
          if (chargeAttackResult[tmp].pos === pos) {
            for (let t of key.list) {
              chargeAttackResult[tmp].damage += parseInt(t.value)
            }
            break
          }
        }
      }
    }
  }
  return {
    na: result,
    ca: chargeAttackResult
  }
}

exports = module.exports = {
  parseSkillDamage,
  parseAttackDamage
}
