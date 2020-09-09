export const state = () => ({
  stadiums: [],
})

export const getters = {
  getStadiums: state => state.stadiums,
}

export const mutations = {
  LOAD_STADIUMS(state, payload) {
    state.stadiums = payload
  }
}

export const actions = {
  async loadStadiums({commit}) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      const data = await this.$axios.$get('/api/stadium/loadStadiums');

      if (data.error) {
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: data.error
        }, {root: true});
      } else {
        await commit('LOAD_STADIUMS', data)
      }
    } catch (e) {
      console.log('Error loadStadiums:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении loadStadiums (см. в консоли ошибку "Error loadStadiums")'
      }, {root: true});
    }
  },

  async updateImage({commit}, payload) {
    const stadium = payload.stadium
    const file = payload.file
    const fileName = payload.fileName

    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      // Если поле image уже было заполнено, то удаляем "старый" файл
      if (stadium.image) {
        await this.$axios('/api/stadium/deleteImage', {
          params: {
            oldFile: stadium.image
          }
        });
      }

      // Сохраняем файл с картинкой
      const fd = new FormData;
      fd.append('subdir', 'stadiums');
      fd.append('fileName', fileName);
      fd.append('file', file);
      fd.append('id', stadium.id);

      const data = await this.$axios.$post('/api/stadium/updateImage', fd);
      if (data.error) {
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: `updateImage: ${data.error}`
        }, {root: true});
      }
    } catch (e) {
      console.log('Error updateImage:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении updateImage (см. в консоли ошибку "Error updateImage")'
      }, {root: true});
    }
  },

  async addStadium({dispatch, commit, getters}, payload) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      const stadium = payload.stadium
      const file = payload.file

      const data = await this.$axios.$get('/api/stadium/addStadium', {
        params: {
          city: stadium.city,
          stadium: stadium.stadium,
          image: stadium.image
        }
      });

      if (data.id) {
        stadium.id = data.id

        const fileExt = file.name.substr(file.name.lastIndexOf('.'));
        const fileName = `${stadium.id}-${Date.now()}${fileExt}`;

        await dispatch('updateImage', {stadium, file, fileName})

        await commit('common/SET_MESSAGE', {
          status: 'success',
          text: `Стадион "${stadium.stadium}" добавлен`
        }, {root: true});

        await dispatch('loadStadiums')
      } else if (data.error) {
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: `updateImage: ${data.error}`
        }, {root: true});
      }
    } catch (e) {
      console.log('Error addStadium:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении addStadium (см. в консоли ошибку "Error addStadium")'
      }, {root: true});
    }
  },

  async updateStadium({dispatch, commit, getters}, payload) {
    const stadium = payload.stadium
    const file = payload.file

    // Если добавлен файл с флагом, то сохраняем его
    if (!!file) {
      const fileExt = file.name.substr(file.name.lastIndexOf('.'));
      const fileName = `${stadium.id}-${Date.now()}${fileExt}`;

      await dispatch('updateImage', {stadium, file, fileName})
      stadium.image = fileName
    }

    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      const data = await this.$axios.$get('/api/stadium/updateStadium', {
        params: {
          city: stadium.city,
          stadium: stadium.stadium,
          image: stadium.image,
          id: stadium.id
        }
      });

      if (data.error) {
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: `updateStadium: ${data.error}`
        }, {root: true});
      } else {
        await dispatch('loadStadiums')
      }
    } catch (e) {
      console.log('Error updateStadium:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении updateStadium (см. в консоли ошибку "Error updateStadium")'
      }, {root: true});
    }
  },

  async deleteStadium({dispatch, commit}, payload) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      const data = await this.$axios.$get('/api/stadium/deleteStadium', {
        params: {
          id: payload.id
        }
      });

      if (data.error) {
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: data.error
        }, {root: true});
      } else {
        await this.$axios('/api/stadium/deleteImage', {
          params: {
            oldFile: payload.image
          }
        });

        await commit('common/SET_MESSAGE', {
          status: 'success',
          text: `Стадион "${payload.stadium}" удален`
        }, {root: true});

        await dispatch('loadStadiums')
      }
    } catch (e) {
      console.log('Error deleteStadium:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении deleteStadium (см. в консоли ошибку "Error deleteStadium")'
      }, {root: true});
    }
  },
}
