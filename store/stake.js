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
  LOAD_STAKES(state, payload) {
    state.stakes = payload
  },
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
          id: payload.id,
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

  async addStake({dispatch, commit}, payload) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      const data = await this.$axios.$get('/api/stake/addStake', {
        params: {
          game_id: payload.game_id,
          gambler_id: payload.gambler_id,
          goal1: payload.goal1,
          goal2: payload.goal2,
        }
      });

      if (data.id) {
        payload.id = data.id
        await dispatch('updatePlayoff', payload);

        await dispatch('loadStakes')
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
  async updateStake({commit}, payload) {

  },
  async updatePlayoff({dispatch, rootGetters}, payload) {
    await dispatch('deleteStakeAddTime', payload);
    await dispatch('deletePenaltyTeam', payload);

    await dispatch('group/loadGroups', null, {root: true})
    const order = rootGetters['group/getGroups'].find((e) => e.id === payload.group_id).order

    // Если это игра плей-офф, то проверяем результат в дополнительное время и по пенальти
    if (order > rootGetters['group/getCountGroups']) {
      if (payload.goal1 && payload.goal2 && payload.goal1 === payload.goal2) {
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

      const data = await this.$axios.$get('/api/game/deleteStakeAddTime', {
        params: {
          id: payload.id
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
}
