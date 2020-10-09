export const state = () => ({
  games: [],
})

export const getters = {
  getGames: state => state.games,
}

export const mutations = {
  LOAD_GAMES(state, payload) {
    state.games = payload
  }
}

export const actions = {
  async loadGames({commit}) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      const data = await this.$axios.$get('/api/game/loadGames');

      if (data.error) {
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: data.error
        }, {root: true});
      } else {
        await commit('LOAD_GAMES', data)
      }
    } catch (e) {
      console.log('Error loadGames:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении loadGames (см. в консоли ошибку "Error loadGames")'
      }, {root: true});
    }
  },

  async addGame({dispatch, commit}, payload) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      const data = await this.$axios.$get('/api/game/addGame', {
        params: {
          start: payload.start,
          game_no: payload.game_no,
          stadium_id: payload.stadium_id,
          group_id: payload.group_id,
          team1_id: payload.team1_id,
          team2_id: payload.team2_id,
          goal1: payload.goal1,
          goal2: payload.goal2,
        }
      });

      if (data.id) {
        payload.id = data.id
        await dispatch('updateAddParameters', payload);

        await dispatch('loadGames')
      } else if (data.error) {
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: `addGame: ${data.error}`
        }, {root: true});
      }
    } catch (e) {
      console.log('Error addGame:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении addGame (см. в консоли ошибку "Error addGame")'
      }, {root: true});
    }
  },

  async updateGame({dispatch, commit}, payload) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      const data = await this.$axios.$get('/api/game/updateGame', {
        params: {
          start: payload.start,
          game_no: payload.game_no,
          stadium_id: payload.stadium_id,
          group_id: payload.group_id,
          team1_id: payload.team1_id,
          team2_id: payload.team2_id,
          goal1: payload.goal1,
          goal2: payload.goal2,
          id: payload.id
        }
      });

      if (data.error) {
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: `updateGame: ${data.error}`
        }, {root: true});
      } else {
        await dispatch('updateAddParameters', payload);

        await dispatch('loadGames')
      }
    } catch (e) {
      console.log('Error updateGame:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении updateGame (см. в консоли ошибку "Error updateGame")'
      }, {root: true});
    }
    //}
  },

  async deleteGame({dispatch, commit}, payload) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      await dispatch('deletepenaltyTeam', payload);
      await dispatch('deleteResultByAddTime', payload);

      const data = await this.$axios.$get('/api/game/deleteGame', {
        params: {
          id: payload.id
        }
      });

      if (data.error) {
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: `deleteGame: ${data.error}`
        }, {root: true});
      } else {
        await commit('common/SET_MESSAGE', {
          status: 'success',
          text: `Игра "${payload.team1} - ${payload.team2}" удалена`
        }, {root: true});

        await dispatch('updateAddParameters', payload);

        await dispatch('loadGames')
      }
    } catch (e) {
      console.log('Error deleteGame:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении deleteGame (см. в консоли ошибку "Error deleteGame")'
      }, {root: true});
    }
  },

  async addResultByAddTime({dispatch, commit}, payload) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      const data = await this.$axios.$get('/api/game/addResultByAddTime', {
        params: {
          id: payload.id,
          goal1: payload.addGoal1,
          goal2: payload.addGoal2,
        }
      });

      if (data.error) {
        console.log('error:', data.error)
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: `addResultByAddTime: ${data.error}`
        }, {root: true});
      }
    } catch (e) {
      console.log('Error addResultByAddTime:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении addResultByAddTime (см. в консоли ошибку "Error addResultByAddTime")'
      }, {root: true});
    }
  },

  async deleteResultByAddTime({dispatch, commit}, payload) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      const data = await this.$axios.$get('/api/game/deleteResultByAddTime', {
        params: {
          id: payload.id
        }
      });

      if (data.error) {
        console.log('error:', data.error)
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: `deleteResultByAddTime: ${data.error}`
        }, {root: true});
      }
    } catch (e) {
      console.log('Error deleteResultByAddTime:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении deleteResultByAddTime (см. в консоли ошибку "Error deleteResultByAddTime")'
      }, {root: true});
    }
  },

  async addPenaltyTeam({dispatch, commit}, payload) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      const data = await this.$axios.$get('/api/game/addPenaltyTeam', {
        params: {
          game_id: payload.id,
          team_id: payload.penaltyId,
        }
      });

      if (data.error) {
        console.log('error:', data.error)
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: `addPenaltyTeam: ${data.error}`
        }, {root: true});
      }
    } catch (e) {
      console.log('Error addPenaltyTeam:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении addPenaltyTeam (см. в консоли ошибку "Error addPenaltyTeam")'
      }, {root: true});
    }
  },

  async deletepenaltyTeam({dispatch, commit}, payload) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      const data = await this.$axios.$get('/api/game/deletepenaltyTeam', {
        params: {
          id: payload.id
        }
      });

      if (data.error) {
        console.log('error:', data.error)
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: `deletepenaltyTeam: ${data.error}`
        }, {root: true});
      }
    } catch (e) {
      console.log('Error deletepenaltyTeam:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении deletepenaltyTeam (см. в консоли ошибку "Error deletepenaltyTeam")'
      }, {root: true});
    }
  },
  async updateAddParameters({dispatch}, payload) {
    await dispatch('deleteResultByAddTime', payload);
    await dispatch('deletepenaltyTeam', payload);

    if (payload.goal1 && payload.goal2 && payload.goal1 === payload.goal2) {
      await dispatch('addResultByAddTime', payload);

      if (payload.addGoal1 && payload.addGoal2 && payload.addGoal1 === payload.addGoal2) {
        await dispatch('addPenaltyTeam', payload);
      }
    }
  }
}
