export const state = () => ({
  countGroupGames: 3,
  countPlayoffGames: 2,
  games: [],
  winners: [],
  gamblers: [
    {
      id: 0,
      gambler: 'Пушкин А.С.',
      summa: 0,
      stakes: [],
      result: [],
      points: 0,
      place: 0,
      total: 0
    },
    {
      id: 0,
      gambler: 'Толстой Л.Н.',
      summa: 0,
      stakes: [],
      result: [],
      points: 0,
      place: 0,
      total: 0
    },
    {
      id: 0,
      gambler: 'Булгаков М.А.',
      summa: 0,
      stakes: [],
      result: [],
      points: 0,
      place: 0,
      total: 0
    },
    {
      id: 0,
      gambler: 'Гоголь Н.В.',
      summa: 0,
      stakes: [],
      result: [],
      points: 0,
      place: 0,
      total: 0
    },
    {
      id: 0,
      gambler: 'Тургенев И.С.',
      summa: 0,
      stakes: [],
      result: [],
      points: 0,
      place: 0,
      total: 0
    },
    {
      id: 0,
      gambler: 'Бунин И.А.',
      summa: 0,
      stakes: [],
      result: [],
      points: 0,
      place: 0,
      total: 0
    },
    {
      id: 0,
      gambler: 'Тютчев Ф.И.',
      summa: 0,
      stakes: [],
      result: [],
      points: 0,
      place: 0,
      total: 0
    },
    {
      id: 0,
      gambler: 'Есенин С.А.',
      summa: 0,
      stakes: [],
      result: [],
      points: 0,
      place: 0,
      total: 0
    },
    {
      id: 0,
      gambler: 'Чехов А.П.',
      summa: 0,
      stakes: [],
      result: [],
      points: 0,
      place: 0,
      total: 0
    },
    {
      id: 0,
      gambler: 'Некрасов Н.А.',
      summa: 0,
      stakes: [],
      result: [],
      points: 0,
      place: 0,
      total: 0
    },
  ],
})

export const getters = {
  getGamblers: state => state.gamblers,
  getGames: state => state.games,
  getCountGroupGames: state => state.countGroupGames,
  getGamblersByPoints: state => state.gamblers.slice().sort((a, b) => { // сортируется КОПИЯ state.gamblers !!!
    // Используем toUpperCase() для преобразования регистра
    const points1 = a.points;
    const points2 = b.points;
    const gambler1 = a.gambler.toUpperCase();
    const gambler2 = b.gambler.toUpperCase();

    let result;

    if (points1 > points2) {
      result = -1;
    } else if (points1 < points2) {
      result = 1;
    } else {
      if (gambler1 > gambler2) {
        result = 1;
      } else {
        result = -1;
      }
    }
    return result;
  }),
  getAvgStake: state => {
    return state.gamblers.reduce((sum, e) => sum + e.summa, 0) / state.gamblers.length
  },
  getAllStakes: state => {
    return state.gamblers.reduce((sum, e) => sum + e.summa, 0)
  },
  getWinners: state => state.winners,
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
      e.summa += (e.summa < payload.max ? Math.floor(Math.random() * 99) : 0)

      const minPoints = 116
      const maxPoints = 117
      e.points = Math.floor(Math.random() * (maxPoints - minPoints)) + minPoints +
        Math.floor(Math.random() * 9) / 10
    })
  },
  LOAD_STAKES(state) {
    state.gamblers.forEach(e => {
      e.stakes = []

      for (let i = 1; i <= state.countGroupGames; i++) {
        let goal1 = getRandom({min: 0, max: 3})
        let goal2 = getRandom({min: 0, max: 3})
        e.stakes.push({game_id: i, goal1, goal2})
      }
    })

    let emptyStakes = [
      {
        gambler_id: getRandom({min: 1, max: state.gamblers.length}),
        game_id: getRandom({min: 1, max: state.countGroupGames})
      }
    ]
    let idGambler = getRandom({min: 1, max: state.gamblers.length})
    while (idGambler === emptyStakes[0].gambler_id) {
      idGambler = getRandom({min: 1, max: state.countGroupGames})
    }

    emptyStakes.push({
      gambler_id: idGambler,
      game_id: getRandom({min: 1, max: state.countGroupGames})
    })

    state.gamblers[emptyStakes[0].gambler_id - 1].stakes[emptyStakes[0].game_id - 1].goal1 = ''
    state.gamblers[emptyStakes[0].gambler_id - 1].stakes[emptyStakes[0].game_id - 1].goal2 = ''

    state.gamblers[emptyStakes[1].gambler_id - 1].stakes[emptyStakes[1].game_id - 1].goal1 = ''
    state.gamblers[emptyStakes[1].gambler_id - 1].stakes[emptyStakes[1].game_id - 1].goal2 = ''

    state.gamblers.forEach(e => {
      let gameId = state.countGroupGames + 1

      for (let i = 1; i <= state.countPlayoffGames; i++) {
        let goal1 = getRandom({min: 0, max: 3})
        let goal2 = getRandom({min: 0, max: 3})

        let addGoal1 = ''
        let addGoal2 = ''
        let penaltyId = 0

        if (goal1 === goal2) {
          addGoal1 = getRandom({min: goal1, max: 3})
          addGoal2 = getRandom({min: goal1, max: 3})

          if (addGoal1 === addGoal2) {
            penaltyId = getRandom({min: 1, max: 2})
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
      let goal1 = getRandom({min: 0, max: 3})
      let goal2 = getRandom({min: 0, max: 3})
      state.games.push({id: i, goal1, goal2})
    }

    let gameId = state.countGroupGames + 1

    for (let i = 1; i <= state.countPlayoffGames; i++) {
      let goal1 = getRandom({min: 0, max: 3})
      let goal2 = goal1

      let addGoal1 = getRandom({min: goal1, max: 3})
      let addGoal2 = getRandom({min: goal1, max: 3})

      state.games.push({
        id: gameId,
        goal1,
        goal2,
        addGoal1,
        addGoal2,
        penaltyId: addGoal1 === addGoal2 ? getRandom({min: 1, max: 2}) : 0
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
        ((e.points.winPoints + e.points.drawPoints + e.points.defeatPoints) / 3 / 2).toFixed(2)
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
          //points = parseFloat((gamePoints * 2).toFixed(2))
          points = gamePoints * 2
          //Если не ничья и угадана разница мячей
        } else if (e.goal1 !== e.goal2
          && stake.goal1 - stake.goal2 === e.goal1 - e.goal2) {
          //points = parseFloat((gamePoints * 1.25).toFixed(2))
          points = gamePoints * 1.25
          //Если угадан результат
        } else if ((stake.goal1 > stake.goal2 && e.goal1 > e.goal2)
          || (stake.goal1 === stake.goal2 && e.goal1 === e.goal2)
          || (stake.goal1 < stake.goal2 && e.goal1 < e.goal2)) {
          //points = parseFloat((gamePoints).toFixed(2))
          points = gamePoints

          //Если угадано количество забитых или пропущенных мячей
          if (stake.goal1 === e.goal1 || stake.goal2 === e.goal2) {
            //points = parseFloat((gamePoints * 1.1).toFixed(2))
            points = gamePoints * 1.1
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
        points = parseFloat(points.toFixed(2))
        g.result.push({game_id: e.id, points})
      })
    })
  },
  SET_PLACE(state, payload) {
    state.gamblers.find(g => g.id === payload.id).place = payload.place
  },
  CLEAR_WINNERS(state) {
    state.winners = []
  },
  SET_WINNER(state, payload) {
    state.winners.push(payload)
  },
}

export const actions = {
  calcPlaces({state, getters, commit}) {
    let win1Count = 1
    let win2Count = 1
    let win3Count = 1
    let win1Points = 0
    let win2Points = 0
    let win3Points = 0
    let place = 1
    let delta = 0

    let gamblers = getters.getGamblersByPoints
    gamblers.forEach((e, i, arr) => {
      if (i > 0) {
        if (arr[i].points === arr[i - 1].points) {
          switch (place) {
            case 1:
              win1Count++
              if (win2Count === 0) win3Count = 0
              else win2Count = 0
              break
            case 2:
              win2Count++
              win3Count = 0
              break
            case 3:
              win3Count++
              break
          }
          delta++
        } else {
          switch (place) {
            case 2:
              win2Points = arr[i - 1].points
              break
            case 3:
              win3Points = arr[i - 1].points
              break
          }

          place += (delta + 1)
          delta = 0
        }
      } else {
        win1Points = arr[0].points
      }
      commit('SET_PLACE', {id: e.id, place})
    })

    commit('CLEAR_WINNERS')

    let summa1 = 0
    let coef = 0
    let winners = []
    const countGamblers = getters.getGamblers.length

    gamblers.filter(e => e.place <= 3).forEach(g => {
      let winner = {}

      winner.coef = g.summa / getters.getAvgStake

      switch (g.place) {
        case 1:
          winner.summa1 = g.summa * (countGamblers / 3)
          if (win1Count <= 2) {
            winner.coef *= ((win1Points - (win3Count > 0 ? win3Points : win2Points)) / 10 + 1)
          }
          break
        case 2:
          winner.summa1 = g.summa * (countGamblers / 6)
          if (win2Count === 1) {
            winner.coef *= ((win2Points - win3Points) / 10 + 1)
          }
          break
        case 3:
          winner.summa1 = g.summa * (countGamblers / 12)
          break
      }

      winner.id = g.id
      winner.gambler = g.gambler
      winners.push(winner)

      coef += winner.coef
      summa1 += winner.summa1
    })

    const residual = (getters.getAllStakes - summa1) / coef

    winners.forEach(e => {
      e.summa2 = e.coef * residual
      e.summa = parseFloat((e.summa1 + e.summa2).toFixed(2))
      //e.summa = parseFloat(((e.summa1 + e.summa2) / 50).toFixed(0)) * 50
      e.summa = parseFloat((e.summa1 + e.summa2).toFixed(0))
      commit('SET_WINNER', e)
    })
  }
}

function getRandom(payload) {
  return parseInt(Math.round(payload.min - 0.5 + Math.random() * (payload.max - payload.min + 1)))
}
