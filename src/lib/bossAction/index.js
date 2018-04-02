function nextKey (arr, per) {
  const e = Object.keys(arr).filter(item => {
    return parseFloat(item) < per
  })
  let max = e[0]
  e.forEach(element => {
    if (parseFloat(element) > parseFloat(max)) {
      max = element
    }
  })
  return max
}

function lastKey (arr, per) {
  const e = Object.keys(arr).filter(item => {
    return parseFloat(item) > per
  })
  let min = e[0]
  e.forEach(element => {
    if (parseFloat(element) < parseFloat(min)) {
      min = element
    }
  })
  return min
}

export default {
  'Lvl 200 Ultimate Bahamut' (bossData) {
    let percent = bossData.hp / bossData.hpmax

    let atks = {
      1.0: '',
      0.75: '单体攻击 可能会上标记 有标记时下一回合五彩大炮',
      0.50: '喷火AOE',
      0.3: '不普攻',
      0.10: '单体攻击',
      0: 'aoe'
    }
    let nps = {
      1.0: '',
      0.85: '奥义不明',
      0.75: '百分比白字吹风\n喷火 全体多段伤害 最后大伤害 附带灼热 降奥义',
      0.5: '神光 光1w AOE',
      0.3: 'DPT检查阶段 满豆超越',
      0.1: '非OD:水AOE+驱散\n   土AOE+我方降连+超巴三连buff\nOD:大破',
      0: '不清楚'
    }
    let specialActions = {
      0.01: '1% 五彩大炮',
      0.05: '5% 暗aoe 1w5',
      0.15: '15% 大破',
      0.22: '22%特动 水AOE 驱动',
      0.28: '28 触发满豆',
      0.3: '30 驱散',
      0.35: '35特动 四属陨石',
      0.4: '40特动 白字陨石',
      0.45: '45特动 四属陨石',
      0.5: '50特动 白字陨石',
      0.55: '55特动 喷火 最后大伤害 附带石化',
      0.7: '70特动 神光 附加印记',
      0.75: '75特动 5w土伤害',
      0.8: '80 触发满豆',
      0.85: '85 喷火 全体多段伤害 最终大伤害 灼热 降奥义DB',
      0.95: '95 1w风伤 高昂',
      1.0: ''
    }

    const nKey = nextKey(specialActions, percent)
    const lKey = lastKey(specialActions, percent)
    const aKey = nextKey(atks, percent)
    const npKey = nextKey(nps, percent)

    return {
      special: {
        next: specialActions[nKey],
        last: specialActions[lKey]
      },
      atk: atks[aKey],
      np: nps[npKey]
    }
  }
}
