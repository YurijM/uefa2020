import Cookie from 'cookie'
import Cookies from 'js-cookie'
import jwtDecode from 'jwt-decode'

export const state = () => ({
  gambler: null,
  token: null,
  gamblers: [],
  adminGamblers: [],
});

export const getters = {
  getGambler: state => state.gambler,
  isSign: state => (!!state.gambler && (state.gambler.status === 0)),
  isAuth: state => (!!state.gambler && (state.gambler.status > 0)),
  isAdmin: state => (!!state.gambler && (state.gambler.admin === 1)),
  getGamblers: state => state.gamblers, // всегда отсортирован по points !!!
  getAdminGamblers: state => state.adminGamblers, // всегда отсортирован по имени !!!
  getGamblersByName: state => state.gamblers.slice().sort((a, b) => { // сортируется КОПИЯ state.gamblers !!!
    // Используем toUpperCase() для преобразования регистра
    const family1 = a.family.toUpperCase();
    const family2 = b.family.toUpperCase();
    const name1 = a.name.toUpperCase();
    const name2 = b.name.toUpperCase();

    let result;

    if (family1 > family2) {
      result = 1;
    } else if (family1 < family2) {
      result = -1;
    } else {
      if (name1 > name2) {
        result = 1;
      } else {
        result = -1;
      }
    }
    return result;
  }),

  getGamblersByNick: state => state.gamblers.slice().sort((a, b) => { // сортируется КОПИЯ state.gamblers !!!
    // Используем toUpperCase() для преобразования регистра
    const nickname1 = a.nickname.toUpperCase();
    const nickname2 = b.nickname.toUpperCase();

    return nickname1 > nickname2 ? 1 : -1
  })
};

export const mutations = {
  SET_GAMBLER(state, payload) {
    state.gambler = payload
  },
  SET_TOKEN(state, payload) {
    state.token = payload
  },
  CLEAR_GAMBLER(state) {
    state.gambler = null
  },
  CLEAR_TOKEN(state) {
    state.token = null
  },
  CALCULATE_PLACE(state, payload) {
    let gamblers = state.gamblers

    gamblers.find((e) => e.id === payload.id).points = payload.points
    gamblers.sort((a, b) => a.points < b.points)

    gamblers.reduce(function (obj, item, i, gamblers) {
      if (i === 0) {
        obj.count = 1
      } else if (gamblers[i - 1].points === gamblers[i].points) {
        obj.count++
      } else {
        obj.new_place += obj.count;
        obj.count = 1
      }

      gamblers[i].prev_place = gamblers[i].place;
      gamblers[i].place = obj.new_place;

      return obj
    }, {new_place: 1, count: 1});
  },
  LOAD_GAMBLERS(state, payload) {
    state.adminGamblers = payload
    state.gamblers = payload.filter(e => e.status > 1)
  },
};

export const actions = {
  async setToken({commit}, payload) {
    await this.$axios.setToken(payload, 'Bearer');
    await commit('SET_TOKEN', payload);
    Cookies.set('uefa2020-jwt-token', payload)
  },

  async clearToken({commit}) {
    await this.$axios.setToken(false);
    await commit('CLEAR_TOKEN');
    Cookies.remove('uefa2020-jwt-token');
  },

  async signup({commit, dispatch}, payload) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});
      console.log('signup')
      const data = await this.$axios.$get('/api/gambler/signup', {
        params: {
          nickname: payload.nickname,
          password: payload.password
        }
      });

      if (data.error) {
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: data.error
        }, {root: true});
      } else {
        await commit('SET_GAMBLER', data.gambler);
        await dispatch('setToken', data.token)
      }
    } catch (e) {
      console.log('Error signup:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении signup (см. в консоли ошибку "Error signup")'
      }, {root: true});
    }
  },

  async login({commit, dispatch}, payload) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      const data = await this.$axios.$get('/api/gambler/login', {
        params: {
          login: payload.login,
          password: payload.password
        }
      });

      if (data.error) {
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: data.error
        }, {root: true});
      } else {
        await commit('SET_GAMBLER', data.gambler);
        await dispatch('setToken', data.token);
        await dispatch('chat/loadGamblers', null, {root: true})
      }
    } catch (e) {
      console.log('Error checkGambler:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении checkGambler (см. в консоли ошибку "Error checkGambler")'
      }, {root: true});
    }
  },

  /*async updatePlace({commit, dispatch}, gamblers) {
    await commit('common/CLEAR_MESSAGE', null, {root: true});

    let data = {};
    let errors = [];

    for (let i = 0; i < gamblers.length; i++) {
      try {
        data = await this.$axios.$get('/api/gambler/updatePlace', {
          params: {
            points: gamblers[i].points,
            place: gamblers[i].place,
            prev_place: gamblers[i].prev_place,
            nickname: gamblers[i].nickname,
            id: gamblers[i].id
          }
        });

        if (data.error) {
          errors.push(data.error)
        }
      } catch (e) {
        console.log('Error updatePlace:', e);
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: 'Ошибка при выполнении updatePlace (см. в консоли ошибку "Error updatePlace")'
        }, {root: true});
      }

      if (errors.length > 0) {
        let text = `Ошибка при обновлении поля place у ${errors.length > 1 ? 'игроков' : 'игрока'} ${errors.join(', ')}`
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: text
        }, {root: true});
      } else {
        await dispatch('loadGamblers');
      }
    }
  },*/

  async saveFeatures({commit, dispatch, getters}, payload) {
    await commit('common/CLEAR_MESSAGE', null, {root: true});

    let data = {};
    const gambler = payload.gambler
    /*const changedPoints = payload.changedPoints

    if (changedPoints) {
      await commit('CALCULATE_PLACE', gambler)
      await dispatch('updatePlace', getters.getGamblers);
    }*/

    try {
      data = await this.$axios.$get('/api/gambler/saveFeatures', {
        params: {
          id: gambler.id,
          stake: gambler.stake,
          status: gambler.status,
          admin: gambler.admin
        }
      });

      if (data.error) {
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: data.error
        }, {root: true});
      } else {
        await dispatch('loadGamblers');
      }
    } catch (e) {
      console.log('Error saveFeatures:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении saveFeatures (см. в консоли ошибку "Error saveFeatures")'
      }, {root: true});
    }
  },

  async profile({commit, dispatch}, {gambler, file, breakpoint}) {
    await commit('common/CLEAR_MESSAGE', null, {root: true});

    let fileName = gambler.photo;
    let data = {};

    // Если добавлен файл с фото, то сохраняем его
    if (!!file) {
      try {
        const fileExt = file.name.substr(file.name.lastIndexOf('.'));
        fileName = `${gambler.id}-${Date.now()}${fileExt}`;

        // Если поле photo уже было заполнено, то удаляем "старый" файл
        if (gambler.photo) {
          await this.$axios('/api/gambler/deletePhoto', {
            params: {
              oldFile: gambler.photo
            }
          });
        }

        // Сохраняем файл с фото
        const fd = new FormData;
        fd.append('subdir', 'photo');
        fd.append('fileName', fileName);
        fd.append('file', file);

        data = await this.$axios.$post('/api/gambler/updatePhoto', fd);
      } catch (e) {
        console.log('Error updatePhoto:', e);
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: 'Ошибка при выполнении updatePhoto (см. в консоли ошибку "Error updatePhoto")'
        }, {root: true});
      }
    }

    // Если файл не был выбран (значит он уже был введён ранее)
    // или запись файла в предыдущем блоке if... прошла успешно
    if (!file || data.success) {
      try {
        data = await this.$axios.$get('/api/gambler/profile', {
          params: {
            id: gambler.id,
            nickname: gambler.nickname,
            family: gambler.family,
            name: gambler.name,
            sex: gambler.sex,
            socket_id: gambler.socket_id,
            fileName: fileName,
          }
        });

        if (data.error) {
          await commit('common/SET_MESSAGE', {
            status: 'error',
            text: data.error
          }, {root: true});
        } else {
          await commit('SET_GAMBLER', data);
          await dispatch('loadGamblers');
          await dispatch('point/loadResult', null, {root: true});

          console.log('breakpoint:', breakpoint)
          if (!!file) {
            try {
              data = await this.$axios.$get('/api/gambler/resizePhoto', {
                params: {
                  fileName,
                  breakpoint
                }
              });

              if (data.error) {
                await commit('common/SET_MESSAGE', {
                  status: 'error',
                  text: data.error
                }, {root: true});
              }
            } catch (e) {
              console.log('Error resizePhoto:', e);
              await commit('common/SET_MESSAGE', {
                status: 'error',
                text: 'Ошибка при выполнении resizePhoto (см. в консоли ошибку "Error resizePhoto")'
              }, {root: true});
            }
          }
        }
      } catch (e) {
        console.log('Error profile:', e);
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: 'Ошибка при выполнении profile (см. в консоли ошибку "Error profile")'
        }, {root: true});
      }
    }
  },

  async logout({commit, dispatch, rootGetters}, id) {
    try {
      const data = await this.$axios.$get('/api/gambler/logout', {
        params: {
          id
        }
      });

      if (data.error) {
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: data.error
        }, {root: true});
      } else {
        if (rootGetters['common/getCloseApp']) {
          await commit('common/CLEAR_CLOSE', null, {root: true})
          await commit('CLEAR_GAMBLER')
          await dispatch('clearToken')
          await commit('common/SET_MESSAGE', {
            status: 'primary',
            text: 'Сессия закрыта'
          }, {root: true})
        }
      }
    } catch (e) {
      console.log('Error logout:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении logout (см. в консоли ошибку "Error logout")'
      }, {root: true});
    }
  },

  async autoLogin({commit, dispatch}) {
    /*const cookieStr = process.browser
      ? document.cookie
      : this.app.req.headers.cookie;*/

    /*const cookies = Cookie.parse(cookieStr || '') || {};
    const token = cookies['uefa2020-jwt-token'];*/

    const cookies = process.server
      ? this.app.$cookies.getAll()
      : this.$cookies.getAll();

    const token = cookies['uefa2020-jwt-token'];

    if (!!token) {
      const jwtData = jwtDecode(token) || {};
      const expires = jwtData.exp || 0;

      if ((new Date().getTime() / 1000) < expires) {
        try {
          await commit('common/CLEAR_MESSAGE', null, {root: true});
          const gambler = await this.$axios.$get('/api/gambler/loadGambler', {
            params: {
              id: jwtData.id
            }
          });

          if (gambler) {
            await commit('SET_GAMBLER', gambler);
            await dispatch('setToken', token);

            const cookSocket = cookies['io'];
            //socket.emit('reload', gambler);

            if (cookSocket) {
              gambler.socket_id = cookSocket;
              await dispatch('setSocketId', gambler)
            }
          } else {
            await dispatch('logout')
          }
        } catch (e) {
          console.log('Error loadGambler:', e);
          await commit('common/SET_MESSAGE', {
            status: 'error',
            text: 'Ошибка при выполнении loadGambler (см. в консоли ошибку "Error loadGambler")'
          }, {root: true});
        }
      }
    }
  },

  async loadGamblers({commit, getters}) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      const data = await this.$axios.$get('/api/gambler/loadGamblers');

      if (data.error) {
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: data.error
        }, {root: true});
      } else {
        await commit('LOAD_GAMBLERS', data)
        if (!!getters.getGambler) {
          await commit('SET_GAMBLER', data.find(e => e.id === getters.getGambler.id))
        }
      }
    } catch (e) {
      console.log('Error loadGamblers:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении loadGamblers (см. в консоли ошибку "Error loadGamblers")'
      }, {root: true});
    }
  },

  async setSocketId({commit}, payload) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      const data = await this.$axios.$get('/api/gambler/setSocketId', {
        params: {
          id: payload.id,
          socketId: payload.socket_id
        }
      });

      if (data.error) {
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: data.error
        }, {root: true});
      }
    } catch (e) {
      console.log('Error setSocketId:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении setSocketId (см. в консоли ошибку "Error setSocketId")'
      }, {root: true});
    }
  },

  async disconnectGamblersBySocket({commit, dispatch}, payload) {
    try {
      const data = await this.$axios.$get('/api/gambler/disconnectGamblersBySocket', {
        params: {
          sockets: payload
        }
      });

      if (data.error) {
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: data.error
        }, {root: true});
      }
    } catch (e) {
      console.log('Error disconnectGamblersBySocket:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении disconnectGamblersBySocket (см. в консоли ошибку "Error disconnectGamblersBySocket")'
      }, {root: true});
    }
  }
};
