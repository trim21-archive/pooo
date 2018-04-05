export default {
  // 攻击模式
  'atks': {
    '0': 'aoe'
  },
  // 奥义
  'nps': {
    '1.0': '',
    '0.5': '隨機3連撃火傷+灼熱。我方一人水属性耐性↑25T',
    '0.3': 'DPT检查阶段 满豆超越',
    '0.1': '非OD:水AOE+驱散\n   土AOE+我方降连+超巴三连buff\nOD:大破',
    '0': '不清楚'
  },
  // 特动
  'specialActions': {
    '0.10': '真之力解放(攻擊力大幅UP)火＋水属性多段特大傷害、最後一擊會帶灼熱、麻痺',
    '0.25': '全体火傷 王火水防御↓、弱体全回復、歪曲結界消失',
    '0.5': '芙拉姆變化為水屬性，DA率上升、石化無效'
  },
  dangerAtk (atk) {
    for (let cmd of atk.scenario) {
      if (cmd.cmd === 'condition' && cmd.to === 'player') {
        if (cmd.condition.debuff) {
          for (let db of cmd.condition.debuff) {
            if (db.status === '4002') {
              return '被标记了,快求净化,下一回合五彩大炮了'
            }
          }
        }
      }
    }
  }
}
