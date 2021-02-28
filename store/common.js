export const state = () => ({
  closeApp: false,
  message: null
});

export const getters = {
  getCloseApp: state => state.closeApp,
  getMessage: state => state.message,
  isMessage: state => !!state.message
};

export const mutations = {
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
