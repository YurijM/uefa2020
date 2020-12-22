export const state = () => ({
  points: [],
  pointsGame: [],
  pointsGamblers: []
})

export const getters = {
  getPoints: state => state.points,
  getPointsGame: state => state.pointsGame,
  getPointsGamblers: state => state.pointsGamblers,
}

export const mutations = {
  LOAD_POINTS(state, payload) {
    state.points = payload
  },
  CLEAR_POINTS(state) {
    state.points = []
  },
  LOAD_POINTS_GAME(state, payload) {
    state.pointsGame = payload
  },
  CALC_POINTS_GAME(state, payload) {
    payload.game.points = payload.game.goal1 > payload.game.goal2
      ? payload.gamePoints.winPoints
      : payload.game.goal1 === payload.game.goal2
        ? payload.gamePoints.drawPoints
        : payload.gamePoints.defeatPoints

    payload.stakes.forEach(stake => {
      let points = 0
      //Если угадан счёт
      if (stake.goal1 === payload.game.goal1 && stake.goal2 === payload.game.goal2) {
        points = parseFloat((payload.game.points * 2).toFixed(2))
        //Если не ничья и угадана разница мячей
      } else if (payload.game.goal1 !== payload.game.goal2
        && stake.goal1 - stake.goal2 === payload.game.goal1 - payload.game.goal2) {
        points = parseFloat((payload.game.points * 1.25).toFixed(2))
        //Если угадан результат
      } else if ((stake.goal1 > stake.goal2 && payload.game.goal1 > payload.game.goal2)
        || (stake.goal1 === stake.goal2 && payload.game.goal1 === payload.game.goal2)
        || (stake.goal1 < stake.goal2 && payload.game.goal1 < payload.game.goal2)) {
        points = parseFloat((payload.game.points).toFixed(2))

        //Если угадано количество забитых или пропущенных мячей
        if (stake.goal1 === payload.game.goal1 || stake.goal2 === payload.game.goal2) {
          points = parseFloat((payload.game.points * 1.1).toFixed(2))
        }
        //Если угадано количество забитых или пропущенных мячей
      } else if (stake.goal1 === payload.game.goal1 || stake.goal2 === payload.game.goal2) {
        points = 0.15
      }

      state.pointsGame.push({
        game_id: payload.game.id,
        gambler_id: stake.gambler_id,
        points
      })
    })
  },
  CLEAR_POINTS_GAME(state) {
    state.pointsGame = []
  },
  ADD_POINTS_GAME(state, payload) {
    state.pointsGame.push(payload)
  },
  CALC_PLACES_GAME(state, payload) {
    state.pointsGamblers = []

    state.pointsGame.forEach(item => {
      //let points = item.points
      let sum = item.points

      state.points
      .filter(e => e.game_no < payload && e.gambler_id === item.gambler_id)
      .forEach(e => sum += parseFloat(e.points))

      state.pointsGamblers.push({
        //game_id: item.game_id,
        gambler_id: item.gambler_id,
        //game_no: payload,
        points: sum
      })
    })

    state.pointsGamblers.sort((a, b) => a.points < b.points)

    let place = 0
    let count = 0

    state.pointsGamblers.forEach((e, i, arr) => {
      if (i === 0) {
        e.place = 1
        place = 1
        count = 1
      } else {
        if (arr[i - 1].points === e.points) {
          e.place = place
          count++
        } else {
          place += count
          count = 1
          e.place = place
        }
      }

      //let item = state.pointsGame.find(el => el.game_id === e.game_id && el.gambler_id === e.gambler_id)
      let item = state.pointsGame.find(el => el.gambler_id === e.gambler_id)
      //item.points = e.points
      item.place =  e.place
    })
  },
  UPDATE_PLACE_GAME(state, payload) {
    let item = state.points.find(e => e.game_id === payload.game_id && e.gambler_id === payload.gambler_id)
    item.points = payload.points
    item.place = payload.place
  }
}

export const actions = {
  async loadPoints({commit}) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      const data = await this.$axios.$get('/api/point/loadPoints');

      if (data.error) {
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: data.error
        }, {root: true});
      } else {
        await commit('LOAD_POINTS', data)
      }
    } catch (e) {
      console.log('Error loadPoints:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении loadPoints (см. в консоли ошибку "Error loadPoints")'
      }, {root: true});
    }
  },
  async savePoints({commit, getters}, payload) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true})

      const findGame = getters.getPoints.find(e => e.game_id === payload)
      const items = getters.getPointsGame

      for (let item of items) {
        let params = {
          points: item.points,
          place: item.place,
          game_id: item.game_id,
          gambler_id: item.gambler_id
        }

        let data = findGame
          ? await this.$axios.$get('/api/point/updatePoints', {params})
          : await this.$axios.$get('/api/point/insertPoints', {params})

        if (data.error) {
          await commit('common/SET_MESSAGE', {
            status: 'error',
            text: data.error
          }, {root: true});
        } else {
          if (findGame) {
            commit('UPDATE_PLACE_GAME', params)
          }/* else {
            params.game_no = rootGetters['game/getGames'].find(e => e.id === payload).game_no
            commit('ADD_POINT', params)
          }*/
          /*await commit('common/SET_MESSAGE', {
            status: 'success',
            text: `Очки за игру "${payload.team1} - ${payload.team2}" удалены`
          }, {root: true});*/
        }
      }
    } catch (e) {
      console.log('Error savePoints:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении savePoints (см. в консоли ошибку "Error savePoints")'
      }, {root: true});
    }
  },
}
