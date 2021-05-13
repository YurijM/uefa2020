<template>
  <v-app>
    <!---------------------------------------------------------------------------------->
    <!-- ЗАГОЛОВОК -->
    <!--<v-app-bar
      app
      clipped-right
      clipped-left
      color="teal lighten-1"
      dark
    >
      <v-toolbar-title>Тотализатор</v-toolbar-title>
    </v-app-bar>-->

    <!-- КОНТЕНТ -->
    <v-main>
      <v-container
        class="fill-height align-start light-blue lighten-5 pa-0"
        fluid
      >
        <nuxt/>
      </v-container>
    </v-main>

    <!-- ПОДВАЛ -->
    <!--<mu-footer color="teal lighten-1"/>-->
  </v-app>
</template>

<script>
  import MuFooter from '~/components/Footer'

  export default {
    name: 'start',
    components: {
      MuFooter
    }
  }
</script>

<style scoped>

</style>
