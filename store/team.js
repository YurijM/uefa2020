export const state = () => ({
  teams: [],
})

export const getters = {
  getTeams: state => state.teams,
}

export const mutations = {
  LOAD_TEAMS(state, payload) {
    state.teams = payload
  }
}

export const actions = {
  async loadTeams({commit}) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      const data = await this.$axios.$get('/api/team/loadTeams');

      if (data.error) {
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: data.error
        }, {root: true});
      } else {
        await commit('LOAD_TEAMS', data)
      }
    } catch (e) {
      console.log('Error loadTeams:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении loadTeams (см. в консоли ошибку "Error loadTeams")'
      }, {root: true});
    }
  },

  async updateFlag({commit}, payload) {
    const team = payload.team
    const file = payload.file
    const fileName = payload.fileName

    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      // Если поле flag уже было заполнено, то удаляем "старый" файл
      if (team.flag) {
        await this.$axios('/api/team/deleteFlag', {
          params: {
            oldFile: team.flag
          }
        });
      }

      // Сохраняем файл с флагом
      const fd = new FormData;
      fd.append('subdir', 'flags');
      fd.append('fileName', fileName);
      fd.append('file', file);
      fd.append('id', team.id);

      const data = await this.$axios.$post('/api/team/updateFlag', fd);
      if (data.error) {
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: `updateFlag: ${data.error}`
        }, {root: true});
      }
    } catch (e) {
      console.log('Error updateFlag:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении updateFlag (см. в консоли ошибку "Error updateFlag")'
      }, {root: true});
    }
  },

  async addTeam({dispatch, commit, getters}, payload) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      const team = payload.team
      const file = payload.file

      const data = await this.$axios.$get('/api/team/addTeam', {
        params: {
          team: team.team,
          flag: team.flag,
          group_id: team.group_id,
          order: team.order
        }
      });

      if (data.id) {
        team.id = data.id

        const fileExt = file.name.substr(file.name.lastIndexOf('.'));
        const fileName = `${team.id}-${Date.now()}${fileExt}`;

        await dispatch('updateFlag', {team, file, fileName})
        await dispatch('loadTeams')
      } else if (data.error) {
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: `updateFlag: ${data.error}`
        }, {root: true});
      }
    } catch (e) {
      console.log('Error addTeam:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении addTeam (см. в консоли ошибку "Error addTeam")'
      }, {root: true});
    }
  },

  async updateTeam({dispatch, commit, getters}, payload) {
    const team = payload.team
    const file = payload.file

    // Если добавлен файл с флагом, то сохраняем его
    if (!!file) {
      const fileExt = file.name.substr(file.name.lastIndexOf('.'));
      const fileName = `${team.id}-${Date.now()}${fileExt}`;

      await dispatch('updateFlag', {team, file, fileName})
      team.flag = fileName
    }

    // Если файл не был выбран (значит он уже был введён ранее)
    //if (!file) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      const data = await this.$axios.$get('/api/team/updateTeam', {
        params: {
          team: team.team,
          flag: team.flag,
          group_id: team.group_id,
          order: team.order,
          place: team.place,
          id: team.id
        }
      });

      if (data.error) {
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: `updateTeam: ${data.error}`
        }, {root: true});
      } else {
        await dispatch('loadTeams')
      }
    } catch (e) {
      console.log('Error updateTeam:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении updateTeam (см. в консоли ошибку "Error updateTeam")'
      }, {root: true});
    }
    //}
  },

  async updateTeamPlace({commit}, payload) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      const data = await this.$axios.$get('/api/team/updateTeamPlace', {
        params: {
          place: payload.place,
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
      console.log('Error updateTeamPlace:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении updateTeamPlace (см. в консоли ошибку "Error updateTeamPlace")'
      }, {root: true});
    }
  },

  async deleteTeam({dispatch, commit}, payload) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      const data = await this.$axios.$get('/api/team/deleteTeam', {
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
        await this.$axios('/api/team/deleteFlag', {
          params: {
            oldFile: payload.flag
          }
        });

        await commit('common/SET_MESSAGE', {
          status: 'success',
          text: `Команда "${payload.team}" удалена`
        }, {root: true});

        await dispatch('loadTeams')
      }
    } catch (e) {
      console.log('Error deleteTeam:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении deleteTeam (см. в консоли ошибку "Error deleteTeam")'
      }, {root: true});
    }
  },
}
