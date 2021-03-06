export const state = () => ({
  games: [],
  game: null,
  playoffGames: []
})

export const getters = {
  getGames: state => state.games,
  getPlayoffGames: state => state.playoffGames,
  getGame: state => state.game,
  getTeamGames: state => id => state.games.filter(g => g.team1_id === id || g.team2_id === id)
  .sort((a, b) => a.game_no > b.game_no),
  getGroupGames: (state, getters, rootState, rootGetters) => (id) => {
    const games = state.games.filter(g => g.group_id === id)
    const teams = rootGetters['team/getTeams'].filter(t => t.group_id === id)

    teams.sort((a, b) => {
      return (a.order > b.order ? 1 : -1)
    })

    const groupGames = teams.map((t, i, arr) => {
      const result = games.filter(g => g.team1 === t.team || g.team2 === t.team).map(e => {
        return {
          order: arr.find(a => a.team === (e.team1 === t.team ? e.team2 : e.team1)).order,
          scope: e.team1 === t.team ? e.goal1 + '-' + e.goal2 : e.goal2 + '-' + e.goal1
        }
      }).sort((a, b) => {
        return (a.order > b.order ? 1 : -1)
      })

      let win = 0, draw = 0, defeat = 0, balls1 = 0, balls2 = 0, points = 0
      result.forEach(r => {
        if (r.scope !== '-') {
          let arr = (r.scope).split('-').map(Number)
          if (arr[0] > arr[1]) {
            win++
            points += 3
          }
          else if (arr[0] < arr[1]) {
            defeat++
          }
          else {
            draw++
            points++
          }
          balls1 += arr[0]
          balls2 += arr[1]
        }
      })

      return {
        order: t.order,
        flag: t.flag,
        team: t.team,
        win, draw, defeat, balls1, balls2, points,
        games: result
      }
    })

    let places = groupGames.slice()
    places.sort((a, b) => {
      if (a.points < b.points) {
        return 1
      } else if (a.points > b.points) {
        return -1
      } else {
        if ((a.balls1 - a.balls2) < (b.balls1 - b.balls2)) {
          return 1
        }
        else if ((a.balls1 - a.balls2) > (b.balls1 - b.balls2)) {
          return -1
        }
        else {
          return (a.balls1 < b.balls1)
        }
      }
    })

    if (places[0].points > 0) {
      let
        place = 1,
        delta = 0,
        points = places[0].points,
        balls1 = places[0].balls1,
        balls2 = places[0].balls2
      places.forEach(p => {
        if (p.win === 0 && p.draw === 0 && p.defeat === 0) {
          groupGames.find(g => g.team === p.team).place = ''
        } else {
          if (p.points === points) {
            if ((p.balls1 - p.balls2) === (balls1 - balls2)) {
              if (p.balls1 === balls1) {
                delta++
              } else {
                place += delta
                //delta = 0
                points = p.points
                balls1 = p.balls1
                balls2 = p.balls2
              }
            } else {
              place += delta
              //delta = 0
              points = p.points
              balls1 = p.balls1
              balls2 = p.balls2
            }
            //delta++
          } else {
            place += delta
            //delta = 0
            points = p.points
            balls1 = p.balls1
            balls2 = p.balls2
          }
          groupGames.find(g => g.team === p.team).place = place
        }
      })
    }

    return groupGames
  },
}

export const mutations = {
  LOAD_GAMES(state, payload) {
    state.games = payload
  },
  CLEAR_GAMES(state) {
    state.games = []
  },
  LOAD_PLAYOFF_GAMES(state, payload) {
    state.playoffGames = payload
  },
  LOAD_GAME(state, payload) {
    state.game = payload
  },
  CLEAR_GAME(state) {
    state.game = []
  },
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

  async loadPlayoffGames({commit, rootGetters}) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      const data = await this.$axios.$get('/api/game/loadPlayoffGames', {
        params: {
          countGroups: rootGetters['group/getCountGroups']
        }
      });

      if (data.error) {
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: data.error
        }, {root: true});
      } else {
        await commit('LOAD_PLAYOFF_GAMES', data)
      }
    } catch (e) {
      console.log('Error loadPlayoffGames:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении loadPlayoffGames (см. в консоли ошибку "Error loadPlayoffGames")'
      }, {root: true});
    }
  },

  async loadGame({commit}, game_id) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      const data = await this.$axios.$get('/api/game/loadGame', {
        params: {
          game_id
        }
      });

      if (data.error) {
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: data.error
        }, {root: true});
      } else {
        await commit('LOAD_GAME', data)
      }
    } catch (e) {
      console.log('Error loadGame:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении loadGame (см. в консоли ошибку "Error loadGame")'
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

      await dispatch('deletePenaltyTeam', payload);
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

  async deletePenaltyTeam({dispatch, commit}, payload) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      const data = await this.$axios.$get('/api/game/deletePenaltyTeam', {
        params: {
          id: payload.id
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
  async updateAddParameters({dispatch, rootGetters}, payload) {
    await dispatch('deleteResultByAddTime', payload);
    await dispatch('deletePenaltyTeam', payload);

    await dispatch('group/loadGroups', null, {root: true})
    const order = rootGetters['group/getGroups'].find((e) => e.id === payload.group_id).order

    // Если это игра плей-офф, то проверяем результат в дополнительное время и по пенальти
    if (order > rootGetters['group/getCountGroups']) {
      if ((payload.addGoal1 != '') && (payload.addGoal2 != '')) {
        await dispatch('addResultByAddTime', payload);

        if (payload.addGoal1 === payload.addGoal2 && payload.penaltyId) {
          await dispatch('addPenaltyTeam', payload);
        }
      }
    }
  },
  async changeResult({commit, dispatch, getters, rootGetters}, payload) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true})

      await dispatch('game/loadGames', null, {root: true})

      await dispatch('point/loadPoints', null, {root: true})

      await dispatch('stake/loadStakesGame', payload.id, {root: true})

      await commit('point/CLEAR_POINTS_GAME', null, {root: true})

      const game = getters.getGames.find((e) => e.id === payload.id)
      const stakes = rootGetters['stake/getStakesGame']
      const gamePoints = rootGetters['stake/getGamePoints']

      await commit('point/CALC_POINTS_GAME', {game, stakes, gamePoints}, {root: true})

      await commit('point/CALC_PLACES_GAME', payload.game_no, {root: true})

      await dispatch('point/savePoints', payload.id, {root: true})

      const points = rootGetters['point/getPoints'].filter(item => item.game_no > payload.game_no)
      let gameId = 0
      for (let item of points) {
        if (gameId !== item.game_id) {
          await commit('point/CLEAR_POINTS_GAME', null, {root: true})

          let gamblers = rootGetters['point/getPoints'].filter(e => e.game_id === item.game_id)
          for (let gambler of gamblers) {
            await commit('point/ADD_POINTS_GAME', {
              game_id: gambler.game_id,
              gambler_id: gambler.gambler_id,
              points: parseFloat(gambler.points)
            }, {root: true})
          }
          await commit('point/CALC_PLACES_GAME', item.game_no, {root: true})
          await dispatch('point/savePoints', item.game_id, {root: true})

          gameId = item.game_id
        }
      }

      await dispatch('point/loadResult', null, {root: true})
    } catch (e) {
      console.log('Error changeResult:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении changeResult (см. в консоли ошибку "Error changeResult")'
      }, {root: true})
    }
  },
}
