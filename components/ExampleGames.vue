<template>
  <div>
    <div class="d-flex align-center justify-space-between my-2">
      <v-btn
        outlined
        small
        @click="toCalculate"
      >
        <v-icon left>far fa-clipboard</v-icon>
        {{ isCalced ? 'Обновить данные' : 'Пример' }}
      </v-btn>

      <h4>Игры</h4>
    </div>

    <v-row
      v-if="isCalced"
      class="align-center justify-center mx-1 rounded"
      :style="{backgroundColor: '#e3ccea', border: '1px solid purple'}"
    >
      <v-col
        cols="auto"
        v-for="(game) of games"
        :key="game.id"
        class="text-center py-0 font-weight-bold"
        :class="game.goal1 > game.goal2 ? 'deep-orange--text text--accent-4' : game.goal1 === game.goal2 ?
        'green--text text--darken-4' : 'light-blue--text text--darken-4'"
      >
        {{ game.goal1 }} : {{ game.goal2 }}
        <div v-if="game.id > countGroupGames" class="black--text text-caption">
          доп. время - {{ game.addGoal1 }} : {{ game.addGoal2 }}
        </div>
        <div v-if="game.penaltyId" class="black--text text-caption">
          по пенальти - {{ game.penaltyId }}-я команда
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'ExampleGames',
  props:{
    isCalced: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      games: 'example/getGames',
      countGroupGames: 'example/getCountGroupGames'
    })
  },
  methods: {
    toCalculate() {
      this.$emit('calculate')
    }
  }
}
</script>

<style scoped>

</style>
