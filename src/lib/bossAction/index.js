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

const files = require.context('./boss', false, /\.js$/)
const modules = {}

files.keys().forEach(key => {
  if (key === './index.js') return

  modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})

export default (battleName) => {
  return {
    hp (bossData) {
      let percent = bossData.hp / bossData.hpmax
      // no battle data
      if (!modules.hasOwnProperty(battleName)) {
        return {
          special: {
            next: '不支持',
            last: '不支持'
          },
          atk: '不支持',
          np: '不支持'
        }
      }
      const { atks, specialActions, nps } = modules[battleName]
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
    },
    dangerAtk (atk) {
      if (modules.hasOwnProperty(battleName) &&
        modules.battleName.hasOwnProperty('dangerAtk')) {
        return modules[battleName].dangerAtk(atk)
      }
    }
  }
}
