export const state = () => ({
  countGroupGames: 3,
  countPlayoffGames: 2,
  gamblers: [
    {
      id: 0,
      gambler: 'Пушкин А.С.',
      summa: 0,
      stakes: [],
      result: []
    },
    {
      id: 0,
      gambler: 'Толстой Л.Н.',
      summa: 0,
      stakes: [],
      result: []
    },
    {
      id: 0,
      gambler: 'Булгаков М.А.',
      summa: 0,
      stakes: [],
      result: []
    },
    {
      id: 0,
      gambler: 'Гоголь Н.В.',
      summa: 0,
      stakes: [],
      result: []
    },
    {
      id: 0,
      gambler: 'Тургенев И.С.',
      summa: 0,
      stakes: [],
      result: []
    },
    {
      id: 0,
      gambler: 'Бунин И.А.',
      summa: 0,
      stakes: [],
      result: []
    },
    {
      id: 0,
      gambler: 'Тютчев Ф.И.',
      summa: 0,
      stakes: [],
      result: []
    },
    {
      id: 0,
      gambler: 'Есенин С.А.',
      summa: 0,
      stakes: [],
      result: []
    },
    {
      id: 0,
      gambler: 'Чехов А.П.',
      summa: 0,
      stakes: [],
      result: []
    },
    {
      id: 0,
      gambler: 'Некрасов Н.А.',
      summa: 0,
      stakes: [],
      result: []
    },
  ],
  games: []
})

export const getters = {
  getGamblers: state => state.gamblers,
  getGames: state => state.games,
  getCountGroupGames: state => state.countGroupGames,
  getCountPlayoffGames: state => state.countPlayoffGames
}

export const mutations = {
  LOAD_SUMMA(state, payload) {
    let id = 1
    state.gamblers = state.gamblers.sort((a, b) => a.gambler > b.gambler)
    state.gamblers.forEach(g => g.id = id++)

    state.gamblers.forEach(e => {
      let number = Math.floor(Math.random() * (payload.max - payload.min)) + payload.min
      let modulo = number % 100
      e.summa = modulo ? number - modulo + (modulo >= 50 ? 100 : 0) : number
    })
  },
  LOAD_STAKES(state) {
    state.gamblers.forEach(e => {
      e.stakes = []

      for (let i = 1; i <= state.countGroupGames; i++) {
        let goal1 = getGoal({min: 0, max: 3})
        let goal2 = getGoal({min: 0, max: 3})
        e.stakes.push({game_id: i, goal1, goal2})
      }
    })

    let emptyStakes = [
      {
        gambler_id: getGoal({min: 1, max: state.gamblers.length}),
        game_id: getGoal({min: 1, max: state.countGroupGames})
      }
    ]
    let idGambler = getGoal({min: 1, max: state.gamblers.length})
    while (idGambler === emptyStakes[0].gambler_id) {
      idGambler = getGoal({min: 1, max: state.countGroupGames})
    }

    emptyStakes.push({
      gambler_id: idGambler,
      game_id: getGoal({min: 1, max: state.countGroupGames})
    })

    state.gamblers[emptyStakes[0].gambler_id - 1].stakes[emptyStakes[0].game_id - 1].goal1 = ''
    state.gamblers[emptyStakes[0].gambler_id - 1].stakes[emptyStakes[0].game_id - 1].goal2 = ''

    state.gamblers[emptyStakes[1].gambler_id - 1].stakes[emptyStakes[1].game_id - 1].goal1 = ''
    state.gamblers[emptyStakes[1].gambler_id - 1].stakes[emptyStakes[1].game_id - 1].goal2 = ''

    state.gamblers.forEach(e => {
      let gameId = state.countGroupGames + 1

      for (let i = 1; i <= state.countPlayoffGames; i++) {
        let goal1 = getGoal({min: 0, max: 3})
        let goal2 = getGoal({min: 0, max: 3})

        let addGoal1 = ''
        let addGoal2 = ''
        let penaltyId = 0

        if (goal1 === goal2) {
          addGoal1 = getGoal({min: goal1, max: 3})
          addGoal2 = getGoal({min: goal1, max: 3})

          if (addGoal1 === addGoal2) {
            penaltyId = getGoal({min: 1, max: 2})
          }
        }

        e.stakes.push({game_id: gameId, goal1, goal2, addGoal1, addGoal2, penaltyId})

        gameId++
      }
    })
  },
  LOAD_GAMES(state, payload) {
    state.games = []

    for (let i = 1; i <= state.countGroupGames; i++) {
      let goal1 = getGoal({min: 0, max: 3})
      let goal2 = getGoal({min: 0, max: 3})
      state.games.push({id: i, goal1, goal2})
    }

    let gameId = state.countGroupGames + 1

    for (let i = 1; i <= state.countPlayoffGames; i++) {
      let goal1 = getGoal({min: 0, max: 3})
      let goal2 = goal1

      let addGoal1 = getGoal({min: goal1, max: 3})
      let addGoal2 = getGoal({min: goal1, max: 3})

      state.games.push({
        id: gameId,
        goal1,
        goal2,
        addGoal1,
        addGoal2,
        penaltyId: addGoal1 === addGoal2 ? getGoal({min: 1, max: 2}) : 0
      })

      gameId++
    }
  },
  CALC_GAME_POINTS(state) {
    let countGamblers = state.gamblers.length

    state.games.forEach(e => {
      //Считаем количество ставок на победу, ничью и поражение
      let winCount = 0
      let drawCount = 0
      let defeatCount = 0

      state.gamblers.forEach(gambler => {
        let stake = gambler.stakes.find(stake => stake.game_id === e.id)
        if (parseInt(stake.goal1) > parseInt(stake.goal2)) winCount++
        if (parseInt(stake.goal1) === parseInt(stake.goal2)) drawCount++
        if (parseInt(stake.goal1) < parseInt(stake.goal2)) defeatCount++
      })

      e.points = {
        winPoints: winCount > 0 ? parseFloat((countGamblers / winCount).toFixed(2)) : 0,
        drawPoints: drawCount > 0 ? parseFloat((countGamblers / drawCount).toFixed(2)) : 0,
        defeatPoints: defeatCount > 0 ? parseFloat((countGamblers / defeatCount).toFixed(2)) : 0
      }
      e.points.avgPoints = parseFloat(
        ((e.points.winPoints + e.points.drawPoints + e.points.defeatPoints) / 6).toFixed(2)
      )
    })
  },
  CALC_RESULT(state) {
    state.gamblers.forEach(g => {
      g.result = []

      state.games.forEach(e => {
        let gamePoints = e.goal1 > e.goal2
          ? e.points.winPoints
          : e.goal1 === e.goal2
            ? e.points.drawPoints
            : e.goal1 < e.goal2
              ? e.points.defeatPoints
              : e.points.avgPoints

        let stake = g.stakes.find(s => s.game_id === e.id)

        let points = 0

        //Если ставка не сделана
        if (stake.goal1 === '') {
          points = -e.points.avgPoints
          //Если угадан счёт
        } else if (stake.goal1 === e.goal1 && stake.goal2 === e.goal2) {
          points = parseFloat((gamePoints * 2).toFixed(2))
          //Если не ничья и угадана разница мячей
        } else if (e.goal1 !== e.goal2
          && stake.goal1 - stake.goal2 === e.goal1 - e.goal2) {
          points = parseFloat((gamePoints * 1.25).toFixed(2))
          //Если угадан результат
        } else if ((stake.goal1 > stake.goal2 && e.goal1 > e.goal2)
          || (stake.goal1 === stake.goal2 && e.goal1 === e.goal2)
          || (stake.goal1 < stake.goal2 && e.goal1 < e.goal2)) {
          points = parseFloat((gamePoints).toFixed(2))

          //Если угадано количество забитых или пропущенных мячей
          if (stake.goal1 === e.goal1 || stake.goal2 === e.goal2) {
            points = parseFloat((gamePoints * 1.1).toFixed(2))
          }
          //Если угадано количество забитых или пропущенных мячей
        } else if (stake.goal1 === e.goal1 || stake.goal2 === e.goal2) {
          points = 0.15
        }

        //Если есть ставка на дополнительное время
        if (typeof e.addGoal1 != 'undefined' && stake.addGoal1 != '') {
          //Если угадан счёт в дополнительное время
          if (stake.addGoal1 == e.addGoal1 && stake.addGoal2 == e.addGoal2) {
            points += 2
            //Если не ничья и угадана разница мячей
          } else if (e.addGoal1 !== e.addGoal2
            && stake.addGoal1 - stake.addGoal2 === e.addGoal1 - e.addGoal2) {
            points += 1.25
            //Если угадан результат
          } else if ((stake.addGoal1 > stake.addGoal2 && e.addGoal1 > e.addGoal2)
            || (stake.addGoal1 == stake.addGoal2 && e.addGoal1 == e.addGoal2)
            || (stake.addGoal1 < stake.addGoal2 && e.addGoal1 < e.addGoal2)) {
            points += 1
            //Если угадано количество забитых или пропущенных мячей
            if (stake.addGoal1 == e.addGoal1 || stake.addGoal2 == e.addGoal2) {
              points += 0.1
            }
          } else if (stake.addGoal1 == e.addGoal1 || stake.addGoal2 == e.addGoal2) {
            points += 0.1
          }

          if (e.addGoal1 == e.addGoal2 && stake.penaltyId == e.penaltyId) {
            points += 1
          }
        }
        g.result.push({game_id: e.id, points})
      })
    })
  }
}

function getGoal(payload) {
  return parseInt(Math.round(payload.min - 0.5 + Math.random() * (payload.max - payload.min + 1)))
}

export const actions = {}
