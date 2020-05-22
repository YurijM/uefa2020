import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'
//import SocketIO from "socket.io-client"

export default function({store}) {
  Vue.use(new VueSocketIO ({
    debug: false,
    //connection: 'http://' + (process.env.NOD_ENV === 'production' ? 'localhost:8080' : 'localhost:3000'),
    connection: 'http://localhost:8080',
    vuex: {
      store,
      actionPrefix: 'socket_',
      mutationPrefix: 'SOCKET_'
    }
  }));
}
