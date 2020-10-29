export const state = () => ({
  stakes: [],
  stakeGroups: [],
  stakePlayoff: []
})

export const getters = {
  getStakes: state => state.stakes,
  getStakeGroups: state => state.stakeGroups,
  getStakePlayoff: state => state.stakePlayoff,
}

export const mutations = {
  LOAD_STAKE_GROUPS(state, payload) {
    state.stakeGroups = payload
  },
  LOAD_STAKE_PLAYOFF(state, payload) {
    state.stakePlayoff = payload
  }
}

export const actions = {
  async loadStakes({commit}, payload) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      const controller = payload.source === 'group' ? 'loadStakesForGroups' : 'loadStakesForPlayoff'
      const commitName = payload.source === 'group' ? 'LOAD_STAKE_GROUPS' : 'LOAD_STAKE_PLAYOFF'

      const data = await this.$axios.$get(`/api/stake/${controller}`, {
        params: {
          gambler_id: payload.gambler_id,
          order: payload.order
        }
      });

      if (data.error) {
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: data.error
        }, {root: true});
      } else {
        await commit(commitName, data)
      }
    } catch (e) {
      console.log('Error loadStakes:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении loadStakes (см. в консоли ошибку "Error loadStakes")'
      }, {root: true});
    }
  },

  async addStake({dispatch, commit, rootGetters}, payload) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      const data = await this.$axios.$get('/api/stake/addStake', {
        params: {
          game_id: payload.gameId,
          gambler_id: payload.gambler_id,
          goal1: payload.goal1,
          goal2: payload.goal2,
        }
      });

      if (data.id) {
        payload.stakeId = data.id
        await dispatch('updatePlayoff', payload);

        const order = rootGetters['group/getCountGroups']

        await dispatch('loadStakes', {
          gambler_id: payload.gambler_id,
          order,
          source: payload.order <= order ? 'group' : 'playoff'
        })
      } else if (data.error) {
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: `addStake: ${data.error}`
        }, {root: true});
      }
    } catch (e) {
      console.log('Error addStake:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении addStake (см. в консоли ошибку "Error addStake")'
      }, {root: true});
    }
  },
  async updateStake({dispatch, commit, rootGetters}, payload) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true})

      const data = await this.$axios.$get('/api/stake/updateStake', {
        params: {
          id: payload.stakeId,
          goal1: payload.goal1,
          goal2: payload.goal2,
        }
      });

      console.log('rows:', data.rows)

      if (data.rows) {
        await dispatch('updatePlayoff', payload);

        const order = rootGetters['group/getCountGroups']

        await dispatch('loadStakes', {
          gambler_id: payload.gambler_id,
          order,
          source: payload.order <= order ? 'group' : 'playoff'
        })
      } else if (data.error) {
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: `addStake: ${data.error}`
        }, {root: true});
      }
    } catch (e) {
      console.log('Error updateStake:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении updateStake (см. в консоли ошибку "Error updateStake")'
      }, {root: true});
    }
  },

  async addStakeAddTime({dispatch, commit}, payload) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      console.log('stake_id:', payload.stakeId)
      console.log('addGoal1, addGoal2:', payload.addGoal1, payload.addGoal2)

      const data = await this.$axios.$get('/api/stake/addStakeAddTime', {
        params: {
          stake_id: payload.stakeId,
          goal1: payload.addGoal1,
          goal2: payload.addGoal2,
        }
      });

      if (data.error) {
        console.log('error:', data.error)
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: `addStakeAddTime: ${data.error}`
        }, {root: true});
      }
    } catch (e) {
      console.log('Error addStakeAddTime:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении addStakeAddTime (см. в консоли ошибку "Error addStakeAddTime")'
      }, {root: true});
    }
  },

  async addPenaltyTeam({dispatch, commit}, payload) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      const data = await this.$axios.$get('/api/stake/addPenaltyTeam', {
        params: {
          stake_id: payload.stakeId,
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
  async updatePlayoff({dispatch, rootGetters}, payload) {
    await dispatch('deleteStakeAddTime', payload);
    await dispatch('deletePenaltyTeam', payload);

    await dispatch('group/loadGroups', null, {root: true})

    // Если это игра плей-офф, то проверяем результат в дополнительное время и по пенальти
    if (payload.order > rootGetters['group/getCountGroups']) {
      if (payload.goal1 === payload.goal2) {
        await dispatch('addStakeAddTime', payload);

        if (payload.addGoal1 && payload.addGoal2 && payload.addGoal1 === payload.addGoal2) {
          await dispatch('addPenaltyTeam', payload);
        }
      }
    }
  },
  async deleteStakeAddTime({dispatch, commit}, payload) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      const data = await this.$axios.$get('/api/stake/deleteStakeAddTime', {
        params: {
          stake_id: payload.stakeId
        }
      });

      if (data.error) {
        console.log('error:', data.error)
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: `deleteStakeAddTime: ${data.error}`
        }, {root: true});
      }
    } catch (e) {
      console.log('Error deleteStakeAddTime:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении deleteStakeAddTime (см. в консоли ошибку "Error deleteStakeAddTime")'
      }, {root: true});
    }
  },
  async deletePenaltyTeam({dispatch, commit}, payload) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      const data = await this.$axios.$get('/api/stake/deletePenaltyTeam', {
        params: {
          stake_id: payload.stakeId
        }
      });

      if (data.error) {
        console.log('error:', data.error)
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: `deletePenaltyTeam: ${data.error}`
        }, {root: true});
      }
    } catch (e) {
      console.log('Error deletePenaltyTeam:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении deletePenaltyTeam (см. в консоли ошибку "Error deletePenaltyTeam")'
      }, {root: true});
    }
  },
}
