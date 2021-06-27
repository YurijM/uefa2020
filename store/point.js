export const state = () => ({
  points: [],
  pointsGame: [],
  pointsGamblers: [],
  lastGameIds: [],
  lastPlaces: [],
  result: []
})

export const getters = {
  getPoints: state => state.points,
  getPointsGame: state => state.pointsGame,
  getPointsGamblers: state => state.pointsGamblers,
  getLastGameIds: state => state.lastGameIds,
  getLastPlaces: state => state.lastPlaces,
  getResult: state => state.result
}

export const mutations = {
  LOAD_POINTS(state, payload) {
    state.points = payload
  },
  CLEAR_POINTS(state) {
    state.points = []
  },
  SET_LAST_GAME_IDS(state, payload) {
    state.lastGameIds = []

    if (payload.length > 0) {
      state.lastGameIds.push(payload[0].game_id)
      if (payload.length > 1) {
        state.lastGameIds.push(payload[1].game_id)
      } else {
        state.lastGameIds.push(0)
      }
    } else {
      state.lastGameIds = [0, 0]
    }
  },
  SET_LAST_PLACES(state, payload) {
    state.lastPlaces = payload
  },
  LOAD_RESULT(state, payload) {
    state.result = payload.map(item => {
      let places = state.lastPlaces.find(e => e.gambler_id === item.gambler_id)

      if (places) {
        item.lastPlace = places.lastPlace
        item.prevPlace = places.prevPlace
      } else {
        item.lastPlace = 0
        item.prevPlace = 0
      }

      return item
    })
  },
  LOAD_POINTS_GAME(state, payload) {
    state.pointsGame = payload
  },
  CALC_POINTS_GAME(state, payload) {
    payload.game.points = payload.game.goal1 > payload.game.goal2
      ? payload.gamePoints.winPoints
      : payload.game.goal1 === payload.game.goal2
        ? payload.gamePoints.drawPoints
        : payload.game.goal1 < payload.game.goal2
          ? payload.gamePoints.defeatPoints
          : payload.gamePoints.avgPoints

    payload.stakes.forEach(stake => {
      let points = 0

      //Если ставка не сделана
      if (stake.goal1 === '') {
        points = -payload.gamePoints.avgPoints
        //Если угадан счёт
      } else if (stake.goal1 === payload.game.goal1 && stake.goal2 === payload.game.goal2) {
        //points = parseFloat((payload.game.points * 2).toFixed(2))
        points = payload.game.points * 2
        //Если не ничья и угадана разница мячей
      } else if (payload.game.goal1 !== payload.game.goal2
        && stake.goal1 - stake.goal2 === payload.game.goal1 - payload.game.goal2) {
        //points = parseFloat((payload.game.points * 1.25).toFixed(2))
        points = payload.game.points * 1.25
        //Если угадан результат
      } else if ((stake.goal1 > stake.goal2 && payload.game.goal1 > payload.game.goal2)
        || (stake.goal1 === stake.goal2 && payload.game.goal1 === payload.game.goal2)
        || (stake.goal1 < stake.goal2 && payload.game.goal1 < payload.game.goal2)) {
        //points = parseFloat((payload.game.points).toFixed(2))
        points = payload.game.points

        //Если угадано количество забитых или пропущенных мячей
        if (stake.goal1 === payload.game.goal1 || stake.goal2 === payload.game.goal2) {
          //points = parseFloat((payload.game.points * 1.1).toFixed(2))
          points = payload.game.points * 1.1
        }
        //Если угадано количество забитых или пропущенных мячей
      } else if (stake.goal1 === payload.game.goal1 || stake.goal2 === payload.game.goal2) {
        points = 0.15
      }

      //Если есть ставка на дополнительное время
      if (typeof payload.game.addGoal1 != 'undefined' && payload.game.addGoal1 != '' && stake.addGoal1 != '') {
        //Если угадан счёт в основное и дополнительное время
        if (stake.goal1 == payload.game.goal1 && stake.goal2 == payload.game.goal2 &&
          stake.addGoal1 == payload.game.addGoal1 && stake.addGoal2 == payload.game.addGoal2) {
          points += 2
          //Если не ничья и угадана разница мячей
        } else if (payload.game.addGoal1 !== payload.game.addGoal2
          && stake.addGoal1 - stake.addGoal2 == payload.game.addGoal1 - payload.game.addGoal2) {
          points += 1.25
          //Если угадан результат
        } else if ((stake.addGoal1 > stake.addGoal2 && payload.game.addGoal1 > payload.game.addGoal2)
          || (stake.addGoal1 == stake.addGoal2 && payload.game.addGoal1 == payload.game.addGoal2)
          || (stake.addGoal1 < stake.addGoal2 && payload.game.addGoal1 < payload.game.addGoal2)) {
          points += 1
          //Если не ничья и угадано количество забитых или пропущенных мячей
          if ((payload.game.addGoal1 !== payload.game.addGoal2) &&
            (stake.addGoal1 == payload.game.addGoal1 || stake.addGoal2 == payload.game.addGoal2)) {
            points += 0.1
          }
        } else if (stake.addGoal1 == payload.game.addGoal1 || stake.addGoal2 == payload.game.addGoal2) {
          points += 0.1
        }

        if (payload.game.addGoal1 == payload.game.addGoal2 && payload.game.penaltyId != 0 && stake.penaltyId == payload.game.penaltyId) {
          points += 1
        }
      }

      points = parseFloat(points.toFixed(2))

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

    state.pointsGamblers.sort((a, b) => b.points - a.points)

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
      item.place = e.place
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
  async lastGameIds({commit}) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      const data = await this.$axios.$get('/api/point/lastGameIds');

      if (data.error) {
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: data.error
        }, {root: true});
      } else {
        await commit('SET_LAST_GAME_IDS', data)
      }
    } catch (e) {
      console.log('Error lastGameIds:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении lastGameIds (см. в консоли ошибку "Error lastGameIds")'
      }, {root: true});
    }
  },
  async lastPlaces({commit, getters}) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      const lastGameIds = getters.getLastGameIds

      const data = await this.$axios.$get('/api/point/lastPlaces', {
        params: {
          lastGameId: lastGameIds[0],
          prevGameId: lastGameIds[1]
        }
      });

      if (data.error) {
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: data.error
        }, {root: true});
      } else {
        await commit('SET_LAST_PLACES', data)
      }
    } catch (e) {
      console.log('Error lastPlaces:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении lastPlaces (см. в консоли ошибку "Error lastPlaces")'
      }, {root: true});
    }
  },
  async loadResult({commit, dispatch, getters}) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      await dispatch('lastGameIds')
      await dispatch('lastPlaces')

      const data = await this.$axios.$get('/api/point/loadResult')

      if (data.error) {
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: data.error
        }, {root: true});
      } else {
        await commit('LOAD_RESULT', data)
      }
    } catch (e) {
      console.log('Error loadResult:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении loadResult (см. в консоли ошибку "Error loadResult")'
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
