export const state = () => ({
  ending: {
    id: 0,
    finish: 0,
    message: ''
  },
})

export const getters = {
  getEnding: state => state.ending,
}

export const mutations = {
  LOAD_ENDING(state, payload) {
    state.ending = payload
  }
}

export const actions = {
  async loadEnding({commit}) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      const data = await this.$axios.$get('/api/ending/loadEnding');

      if (data.error) {
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: data.error
        }, {root: true});
      } else {
        await commit('LOAD_ENDING', data[0])
      }
    } catch (e) {
      console.log('Error loadEnding:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении loadEnding (см. в консоли ошибку "Error loadEnding")'
      }, {root: true});
    }
  },

  async updateEnding({commit}, payload) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      const data = await this.$axios.$get('/api/ending/updateEnding', {
        params: {
          finish: payload.finish,
          message: payload.message,
          id: payload.id
        }
      });

      if (data.error) {
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: data.error
        }, {root: true});
      }
    } catch (e) {
      console.log('Error updateEnding:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении updateEnding (см. в консоли ошибку "Error updateEnding")'
      }, {root: true});
    }
  },
}
