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

      <h4>Ставки</h4>
    </div>

    <v-sheet max-width="700" class="mx-auto">
      <v-simple-table
        v-if="isCalced"
        dense
        :style="{backgroundColor: '#e3ccea', border: '1px solid purple'}"
      >
        <template v-slot:default>
          <thead>
          <tr>
            <th class="text-center" rowspan="2">
              Игрок
            </th>
            <th v-for="game in games" class="text-center" colspan="2">
              {{ game.id }}-я игра
              <span v-if="game.id > countGroupGames">
              <br>(плэйофф)
            </span>
            </th>
            <th class="text-center" rowspan="2">Итого</th>
          </tr>
          <tr>
            <template v-for="i in games.length">
              <th class="text-center">Счёт</th>
              <th class="text-center">Очки</th>
            </template>
          </tr>
          </thead>
          <tbody>
          <tr
            v-for="gambler in gamblers"
            :key="gambler.gambler"
          >
            <td>{{ gambler.gambler }}</td>
            <template
              v-for="stake in gambler.stakes"
            >
              <td
                v-if="stake.goal1 !== ''"
                class="text-center"
                :width="stake.game_id > countGroupGames && stake.penaltyId ? '15%': ''"
              >
                {{ stake.goal1 }} : {{ stake.goal2 }}
                <div v-if="stake.game_id > countGroupGames && stake.goal1 === stake.goal2">
                  {{ stake.addGoal1 }} : {{ stake.addGoal2 }}
                </div>
                <div v-if="stake.game_id > countGroupGames && stake.penaltyId">
                  {{ stake.penaltyId }}-я команда
                </div>
              </td>
              <td v-else class="text-center font-weight-bold">нет</td>
              <td class="text-center primary--text font-weight-bold">
                {{ gambler.result[stake.game_id - 1].points }}
              </td>
            </template>
            <td class="text-center deep-orange--text text--accent-4 font-weight-bold">{{
                sum[gambler.id - 1]
              }}
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
  name: 'ExampleStakes',
  props: {
    isCalced: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      gamblers: 'example/getGamblers',
      games: 'example/getGames',
      countGroupGames: 'example/getCountGroupGames',
    }),
    sum() {
      let result = []

      this.gamblers.forEach(g => {
        let points = 0
        g.result.forEach(r => points += r.points)
        result.push(parseFloat(points.toFixed(2)))
      })

      return result
    }
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
