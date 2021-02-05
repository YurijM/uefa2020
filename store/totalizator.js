export const state = () => ({
  gamblers: [],
  games: [],
  points: [],
})

export const getters = {
  getGamblers: state => state.gamblers,
  isGamblers: state => state.gamblers.length,
  getGames: state => state.games,
  isGames: state => state.games.length,
  getPoints: state => state.points,
}

export const mutations = {
  CLEAR_GAMBLERS(state) {
    state.gamblers = []
  },
  LOAD_GAMBLERS(state, payload) {
    state.gamblers = payload
  },
  CLEAR_GAMES(state) {
    state.games = []
  },
  LOAD_GAMES(state, payload) {
    state.games = payload
  },
  CLEAR_POINTS(state) {
    state.points = []
  },
  LOAD_POINTS(state, payload) {
    state.points = payload
  },
  CLEAR_STAKES(state) {
    state.games.forEach(e => e.stakes = [])
  },
  SET_STAKE(state, payload) {
    state.games[payload.idx].stakes.push(payload.stake)
  }
}

export const actions = {
  async loadGamblers({commit}) {
    const gamblers = await this.$axios.$get('/api/totalizator/loadGamblers');

    if (gamblers.error) {
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: gamblers.error
      }, {root: true});
    } else {
      await commit('LOAD_GAMBLERS', gamblers)
    }
  },
  async loadGames({commit}) {
    const games = await this.$axios.$get('/api/totalizator/loadGames');

    if (games.error) {
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: games.error
      }, {root: true});
    } else {
      await commit('LOAD_GAMES', games)
    }
  },
  async loadPoints({commit}, payload) {
    const points = await this.$axios.$get('/api/totalizator/loadPoints', {
      params: {
        gameIds: payload.join(', ')
      }
    });

    if (points.error) {
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: points.error
      }, {root: true});
    } else {
      await commit('LOAD_POINTS', points)
    }
  },
  async loadStakes({commit, dispatch, getters}) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      let gamblers, games, points

      await dispatch('loadGamblers')

      if (getters.isGamblers) {
        gamblers = getters.getGamblers
        await dispatch('loadGames')
      }

      if (getters.isGames) {
        games = getters.getGames

        const gameIds = games.map(e => e.id)

        await dispatch('loadPoints', gameIds)

        points = getters.getPoints

        const stakes = await this.$axios.$get('/api/totalizator/loadStakes', {
          params: {
            gameIds: gameIds.join(', ')
          }
        });

        if (stakes.error) {
          await commit('common/SET_MESSAGE', {
            status: 'error',
            text: stakes.error
          }, {root: true});
        } else {
          commit('CLEAR_STAKES')

          let i = 0

          for (const e of games) {
            let st = stakes.filter(s => s.game_id === e.id)
            let pt = points.filter(s => s.game_id === e.id)

            for (const g of gamblers) {
              let stake = {
                gambler: g.nickname,
                result: '',
                addResult: '',
                penaltyWin: '',
                points: ''
              }

              let s = st.find(i => i.gambler_id === g.id)
              if (s) {
                stake.result = s.result
                stake.addResult = s.addResult
                stake.penaltyWin = s.penaltyWin
              } else {
                stake.result = 'нет'
                /*stake.addResult = ''
                stake.penaltyWin = ''*/
              }

              let p = pt.find(p => p.gambler_id === g.id)
              if (p) {
                stake.points = p.points
              }

              commit('SET_STAKE', {idx: i, stake})
            }
            i++
          }
        }
      }
    } catch (e) {
      console.log('Error loadStakes:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении loadStakes (см. в консоли ошибку "Error loadStakes")'
      }, {root: true});
    }
  }
}

