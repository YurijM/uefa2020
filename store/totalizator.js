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
  getStakes: (state) => (id) => state.games.find(g => g.id === id).stakes
}

export const mutations = {
  LOAD_GAMBLERS(state, payload) {
    state.gamblers = payload
  },
  CLEAR_GAMES(state) {
    state.games = []
  },
  LOAD_GAMES(state, payload) {
    state.games = payload.map(e => {
      e.stakes = []
      return e
    })
  },
  LOAD_POINTS(state, payload) {
    state.points = payload
  },
  SET_STAKES(state, payload) {
    state.games[payload.idx].stakes = payload.stakes
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
          //await commit('CLEAR_STAKES')

          let i = 0

          for (const e of games) {
            let st = stakes.filter(s => s.game_id === e.id)
            let pt = points.filter(s => s.game_id === e.id)

            let gameStakes = []

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
              }

              let p = pt.find(p => p.gambler_id === g.id)
              if (p) stake.points = p.points

              gameStakes.push(stake)
            }
            await commit('SET_STAKES', {idx: i, stakes: gameStakes})
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
