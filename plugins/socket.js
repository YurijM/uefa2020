import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'
//import SocketIO from "socket.io-client"

export default function({store}) {
  Vue.use(new VueSocketIO ({
    debug: false,
    connection: 'http://' + (process.env.NOD_ENV === 'production' ? '89.223.122.221:8080' : 'localhost:3000'),
    vuex: {
      store,
      actionPrefix: 'socket_',
      mutationPrefix: 'SOCKET_'
    }
  }));
}
