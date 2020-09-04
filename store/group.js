export const state = () => ({
  groups: [],
})

export const getters = {
  getGroups: state => state.groups,
}

export const mutations = {
  LOAD_GROUPS(state, payload) {
    state.groups = payload
  }
}

export const actions = {
  async loadGroups({commit}) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      const data = await this.$axios.$get('/api/group/loadGroups');

      if (data.error) {
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: data.error
        }, {root: true});
      } else {
        await commit('LOAD_GROUPS', data)
      }
    } catch (e) {
      console.log('Error loadGroups:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении loadGroups (см. в консоли ошибку "Error loadGroups")'
      }, {root: true});
    }
  },

  async addGroup({commit}, payload) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      const data = await this.$axios.$get('/api/group/addGroup', {
        params: {
          group: payload.group,
          order: payload.order
        }
      });

      if (data.error) {
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: data.error
        }, {root: true});
      }
    } catch (e) {
      console.log('Error addGroup:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении addGroup (см. в консоли ошибку "Error addGroup")'
      }, {root: true});
    }
  },

  async updateGroup({commit}, payload) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      const data = await this.$axios.$get('/api/group/updateGroup', {
        params: {
          group: payload.group,
          order: payload.order,
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
      console.log('Error updateGroup:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении updateGroup (см. в консоли ошибку "Error updateGroup")'
      }, {root: true});
    }
  },

  async deleteGroup({commit}, payload) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      const data = await this.$axios.$get('/api/group/deleteGroup', {
        params: {
          id: payload
        }
      });

      if (data.error) {
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: data.error
        }, {root: true});
      }
    } catch (e) {
      console.log('Error deleteGroup:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении deleteGroup (см. в консоли ошибку "Error deleteGroup")'
      }, {root: true});
    }
  },
}
