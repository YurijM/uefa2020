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
}
