export const state = () => ({
  stakes: [],
  stakesGroups: [],
  stakesPlayoff: [],
  stakesGame: [],
  gamePoints: {
    winPoints: 0,
    drawPoints: 0,
    defeatPoints: 0
  }
})

export const getters = {
  getStakes: state => state.stakes,
  getStakesGroups: state => state.stakesGroups,
  getStakesPlayoff: state => state.stakesPlayoff,
  getStakesGame: state => state.stakesGame,
  getGamePoints: state => state.gamePoints
}

export const mutations = {
  LOAD_STAKES(state, payload) {
    state.stakes = payload
  },
  CLEAR_STAKES(state) {
    state.stakes = []
  },
  LOAD_STAKES_GROUPS(state, payload) {
    state.stakesGroups = payload
  },
  CLEAR_STAKES_GROUPS(state) {
    state.stakesGroups = []
  },
  LOAD_STAKES_PLAYOFF(state, payload) {
    state.stakesPlayoff = payload
  },
  CLEAR_STAKES_PLAYOFF(state) {
    state.stakesPlayoff = []
  },
  LOAD_STAKES_GAME(state, payload) {
    //Сохраняем загруженные стаыки на игру
    state.stakesGame = payload

    //Считаем количество ставок на победу, ничью и поражение
    let winCount = 0
    let drawCount = 0
    let defeatCount = 0

    payload.forEach(stake => {
      if (parseInt(stake.goal1) > parseInt(stake.goal2)) winCount++
      if (parseInt(stake.goal1) === parseInt(stake.goal2)) drawCount++
      if (parseInt(stake.goal1) < parseInt(stake.goal2)) defeatCount++
    })

    //Вычисляем количество очков, присуждаемых за ставку на победу, ничью и поражение
    const len = payload.length

    state.gamePoints.winPoints = winCount > 0 ? len / winCount : 0
    state.gamePoints.drawPoints = drawCount > 0 ? len / drawCount : 0
    state.gamePoints.defeatPoints = defeatCount > 0 ? len / defeatCount : 0
    state.gamePoints.avgPoints = (state.gamePoints.winPoints + state.gamePoints.drawPoints + state.gamePoints.defeatPoints) / 3
  },
  CLEAR_STAKES_GAME(state) {
    state.stakesGame = []

    state.gamePoints = {
      winPoints: 0,
      drawPoints: 0,
      defeatPoints: 0
    }
  },
}

export const actions = {
  async loadStakes({commit}, payload) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      const controller = payload.source === 'group' ? 'loadStakesGroups' : 'loadStakesPlayoff'
      const commitName = payload.source === 'group' ? 'LOAD_STAKES_GROUPS' : 'LOAD_STAKES_PLAYOFF'

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

  async loadStakesGame({commit, getters}, gameId) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      const data = await this.$axios.$get('/api/stake/loadStakesGame', {
        params: {
          gameId
        }
      });

      if (data.error) {
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: data.error
        }, {root: true});
      } else {
        await commit('LOAD_STAKES_GAME', data)
      }
    } catch (e) {
      console.log('Error loadStakesGame:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении loadStakesGame (см. в консоли ошибку "Error loadStakesGame")'
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
