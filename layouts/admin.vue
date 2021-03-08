<template>
  <v-app>
    <v-snackbar
      v-model="snackbar"
      top
      :color="color"
    >
      <!--<v-icon color="yellow" class="mr-5">fas fa-exclamation-circle</v-icon>-->
      <div class="text-center" :style="{width: '100%'}">{{ message }}</div>
    </v-snackbar>

    <!-- Диалог подтверждения выхода из приложения -->
    <mu-dialog-exit v-model="dialog" @closeApp="closeApp"/>

    <mu-drawer-left-admin v-model="drawer"/>

    <!---------------------------------------------------------------------------------->
    <!-- ЗАГОЛОВОК -->
    <v-app-bar
      app
      clipped-left
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
      <v-toolbar-title class="pl-0 yellow--text">Тотализатор</v-toolbar-title>

      <v-spacer/>

      <mu-header-user-admin @openDialog="isOpenDialog"/>
    </v-app-bar>

    <v-main>
      <v-container
        fluid
      >
        <nuxt/>
      </v-container>
    </v-main>

    <!---------------------------------------------------------------------------------->
    <!-- ПОДВАЛ -->
    <mu-footer textColor="yellow"/>
  </v-app>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex'

import MuDrawerLeftAdmin from '~/components/DrawerLeftAdmin'
import MuFooter from '~/components/Footer'
import MuHeaderUserAdmin from '~/components/HeaderUserAdmin'
import MuDialogExit from '~/components/DialogExit'

export default {
  data: () => ({
    dialog: false,
    drawer: true,
    snackbar: false,
    message: '',
    color: ''
  }),
  components: {
    MuDrawerLeftAdmin,
    MuHeaderUserAdmin,
    MuFooter,
    MuDialogExit
  },
  created() {
    this.$vuetify.theme.dark = true

    if (process.browser) {
      if (navigator.userAgent.search('Chrome') > 0) {
        window.addEventListener('unload', this.handlerClose)
      } else {
        window.addEventListener('beforeunload', this.handlerClose)
      }
    }
  },
  destroyed() {
    if (process.browser) {
      if (navigator.userAgent.search('Chrome') > 0) {
        window.removeEventListener('unload', this.handlerClose);
      } else {
        window.removeEventListener('beforeunload', this.handlerClose);
      }
    }
  },
  computed: {
    ...mapGetters({
      getCloseApp: 'common/getCloseApp',
      getMessage: 'common/getMessage',
      isMessage: 'common/isMessage',
      getGambler: 'gambler/getGambler'
    }),
    checkMessage() {
      return this.isMessage;
    }
  },
  watch: {
    checkMessage(isMessage) {
      if (isMessage) {
        const message = this.getMessage;
        this.color = message.status;
        this.message = message.text;
        this.snackbar = true
      }
    }
  },
  methods: {
    ...mapMutations({
      setCloseApp: 'common/SET_CLOSE',
      clearCloseApp: 'common/CLEAR_CLOSE'
    }),
    ...mapActions({
      logout: 'gambler/logout'
    }),
    isOpenDialog(data) {
      this.dialog = data.dialog
    },
    async closeApp(data) {
      this.dialog = false;

      if (data.close) {
        await this.setCloseApp()

        const gambler = this.getGambler;

        await this.logout(gambler.id);

        this.$socket.emit('logout', {gambler, closeApp: this.getCloseApp});

        await this.$router.push('/login');
      } else {
        await this.clearCloseApp()
      }
    },
    handlerClose(event) {
      //event.preventDefault()

      const gambler = this.getGambler

      this.logout(gambler.id)
      this.$socket.emit('logout', {gambler, closeApp: this.getCloseApp})

      //event.returnValue = ''
      //return null
    },
  }
}
</script>

<style scoped>

</style>
