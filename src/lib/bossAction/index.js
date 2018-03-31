export default {
  /**
       * @return {string}
       */
  'Lvl 200 Ultimate Bahamut' (bossData) {
    let percent = bossData.hp / bossData.hpmax
    if (percent < 0.01) {
      return '1% 五彩大炮'
    } if (percent < 0.05) {
      return '5% 暗aoe 1w5'
    } if (percent < 0.15) {
      return '15% 大破'
    } if (percent < 0.22) {
      return '22%特动 水AOE 驱动'
    } if (percent < 0.28) {
      return '28 触发满豆'
    } if (percent < 0.30) {
      return '30 驱散'
    } if (percent < 0.35) {
      return '35特动 四属陨石'
    } if (percent < 0.40) {
      return '40特动 白字陨石'
    } if (percent < 0.45) {
      return '45特动 四属陨石'
    } if (percent < 0.50) {
      return '50特动 白字陨石'
    } if (percent < 0.55) {
      return '55特动 喷火 最后大伤害 附带石化'
    } if (percent < 0.70) {
      return '70特动 神光 附加印记'
    } if (percent < 0.75) {
      return '75特动 5w土伤害'
    } if (percent < 0.80) {
      return '80 触发满豆'
    } if (percent < 0.85) {
      return '85特动'
    } if (percent < 0.95) {
      return '95特动'
    }
  }
}
