export const state = () => ({
  showWinners: true,
  closeApp: false,
  message: null
});

export const getters = {
  getShowWinners: state => state.showWinners,
  getCloseApp: state => state.closeApp,
  getMessage: state => state.message,
  isMessage: state => !!state.message
};

export const mutations = {
  SET_SHOW_WINNERS(state) {
    state.showWinners = true
  },
  CLEAR_SHOW_WINNERS(state) {
    state.showWinners = false
  },
  SET_CLOSE(state) {
    state.closeApp = true
  },
  CLEAR_CLOSE(state) {
    state.closeApp = false
  },
  SET_MESSAGE(state, payload) {
    state.message = payload;
  },
  CLEAR_MESSAGE(state) {
    state.message = null
  }
};
