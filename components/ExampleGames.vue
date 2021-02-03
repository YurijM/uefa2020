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

      <h4>Результаты игр</h4>
    </div>

    <v-sheet max-width="600" class="mx-auto">
      <v-simple-table
        v-if="isCalced"
        dense
        :style="{backgroundColor: '#e3ccea', border: '1px solid purple'}"
      >
        <template v-slot:default>
          <thead>
          <tr>
            <th
              v-for="game in games"
              v-if="game.id <= countGroupGames"
              class="text-center"
            >
              {{ game.id }}-я игра
            </th>

            <th class="text-center"><b>. . .</b></th>

            <th
              v-for="game in games"
              v-if="game.id > countGroupGames"
              class="text-center"
            >
              {{ game.id }}-я игра
              <br>(плэйофф)
            </th>
          </tr>
          </thead>

          <tbody>
          <tr class="text-center">
            <td
              v-for="(game) of games"
              v-if="game.id <= countGroupGames"
              :key="game.id"
              class="font-weight-bold"
              :class="game.goal1 > game.goal2
              ? 'deep-orange--text text--accent-4'
              : game.goal1 === game.goal2
              ? 'green--text text--darken-4'
              : 'light-blue--text text--darken-4'"
            >
              {{ game.goal1 }} : {{ game.goal2 }}
            </td>

            <td class="text-center"><b>. . .</b></td>

            <td
              v-for="(game) of games"
              v-if="game.id > countGroupGames"
              :key="game.id"
              class="font-weight-bold green--text text--darken-4"
            >
              {{ game.goal1 }} : {{ game.goal2 }}
              <div class="black--text text-caption">
                доп. время - {{ game.addGoal1 }} : {{ game.addGoal2 }}
              </div>
              <div v-if="game.penaltyId" class="black--text text-caption">
                по пенальти - {{ game.penaltyId }}-я команда
              </div>
            </td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-sheet>
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
