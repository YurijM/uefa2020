<template>
  <div :style="{width: '100%'}">
    <h2 class="text-center my-2 teal--text">Участники</h2>
    <div class="d-flex flex-wrap flex-row justify-center px-1">
      <v-card
        v-if="getGambler.status === 1"
        width="175"
        outlined
        class="mb-1 dark blue-grey lighten-4"
        :style="{border: '1px solid ' + (getGambler.sex === 'ж' ? 'red' : 'blue') + ' !important'}"
      >
        <v-img
          lazy-src="/user.jpg"
          src="/user.jpg"
          class="white--text align-end"
        >
          <template v-slot:placeholder>
            <v-row
              class="fill-height ma-0"
              align="center"
              justify="center"
            >
              <v-progress-circular indeterminate color="black"></v-progress-circular>
            </v-row>
          </template>
        </v-img>

        <v-card-title
          class="pa-1 flex-column caption text-center"
          style="word-break: normal !important"
          :style="{borderTop: '1px solid ' + (getGambler.sex === 'ж' ? 'red' : 'blue') + ' !important'}"
        >
          <div>После оплаты участия здесь будет Ваше фото</div>
        </v-card-title>
      </v-card>

      <v-card
        v-for="(gambler, i) in gamblers"
        :key="gambler.id"
        width="175"
        outlined
        class="mb-1 dark blue-grey lighten-4"
        :class="(i > 0 || getGambler.status === 1) ? 'ml-1' : ''"
        :style="{border: '1px solid ' + (gambler.sex === 'ж' ? 'red' : 'blue') + ' !important'}"
      >
        <v-img
          lazy-src="/user.jpg"
          :src="`/photo/${gambler.photo}`"
          class="white--text align-end"
        >
          <template v-slot:placeholder>
            <v-row
              class="fill-height ma-0"
              align="center"
              justify="center"
            >
              <v-progress-circular indeterminate color="black"></v-progress-circular>
            </v-row>
          </template>
        </v-img>

        <v-card-title
          class="pa-1 flex-column caption text-center"
          style="word-break: normal !important"
          :style="{borderTop: '1px solid ' + (gambler.sex === 'ж' ? 'red' : 'blue') + ' !important'}"
        >
          <div>{{gambler.family}} {{gambler.name}}</div>
          <div>({{gambler.nickname}})</div>
        </v-card-title>
      </v-card>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: 'gambler',
    computed: {
      ...mapGetters({
        getGamblersByName: 'gambler/getGamblersByName',
        getGambler: 'gambler/getGambler'
      }),
      gamblers() {
        return this.getGamblersByName
      }
    }
  }
</script>

<style scoped>

</style>
