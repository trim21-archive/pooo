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
        for (let tmp of key.list) {
          if (tmp.to === 'boss') {
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
  for (let key of o.scenario) {
    if (key.cmd === 'attack') {
      let damage = 0
      for (let tmp of key.damage) {
        for (let t of tmp) {
          damage += parseInt(t.value)
        }
      }
      result.push({
        pos: key.pos,
        damage
      })
    }

    if (key.cmd === 'special' || key.cmd === 'special_npc') {
      let damage = 0
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
  }
  return {
    na: result,
    ca: chargeAttackResult
  }
}

export default {
  parseSkillDamage,
  parseAttackDamage
}
