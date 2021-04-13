<template>
  <v-row justify="center" dense>
    <v-col cols="12" class="text-center">
      <h2 class="text-center mt-1 purple--text">Тотализатор</h2>
    </v-col>

    <v-col
      cols="auto"
      v-for="game in games"
      :key="game.id"
      class="text-center"
    >
      <div class="text-body-1 font-weight-black">
        {{ game.group }}
      </div>
      <div class="text-body-2 font-weight-black">
        {{ game.game }} {{ game.result }} {{ stakesWin(game.id) }}
        {{ win }}, {{ draw }}, {{ defeat }}, {{ avg }}
        <template v-if="game.addResult">
          доп. время - {{ game.addResult }}
          <template v-if="game.penaltyWin">
            по пенальти - {{ game.penaltyWin }}
          </template>
        </template>
      </div>

      <v-simple-table
        dense
        class="text-body-1"
        :style="{backgroundColor: '#e3ccea', border: '1px solid purple'}"
      >
        <template v-slot:default>
          <thead>
          <tr>
            <th class="text-center">Игрок</th>
            <th class="text-center">Прогноз</th>
            <th class="text-center">Очки</th>
          </tr>
          </thead>
          <tbody>
          <tr
            v-for="stake in stakes(game.id)"
            :key="stake.gambler"
          >
            <td class="text-left">{{ stake.gambler }}</td>
            <td>
              {{ stake.result }}
              <template v-if="stake.addResult">
                доп. время - {{ stake.addResult }}
                <template v-if="stake.penaltyWin">
                  по пенальти - {{ stake.penaltyWin }}
                </template>
              </template>
            </td>
            <td class="font-weight-bold">{{ stake.points }}</td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-col>
  </v-row>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'totalizator',
  async asyncData({store}) {
    await store.dispatch('totalizator/loadStakes')
  },
  data() {
    return {
      win: 0,
      draw: 0,
      defeat: 0,
      avg: 0
    }
  },
  computed: {
    ...mapGetters({
      games: 'totalizator/getGames',
      stakes: 'totalizator/getStakes'
    }),
  },
  methods: {
    stakesWin(gameId) {
      this.win = 0
      this.draw = 0
      this.defeat = 0
      this.avg = 0

      const results = this.stakes(gameId).map(s => s.result)
      results.forEach(s => {
        let result = s.split(':')
        if (result[0] !== 'нет') {
          if (result[0] > result[1]) this.win++
          else if (result[0] < result[1]) this.defeat++
          else this.draw++
        }
      })
      const avg = results.length / (this.win + this.defeat + this.draw) / 6
      this.avg = parseFloat(avg).toFixed(2)
      this.win = (this.win > 0 ? parseFloat(results.length / this.win).toFixed(2) : 0)
      this.draw = (this.draw > 0 ? parseFloat(results.length / this.draw).toFixed(2) : 0)
      this.defeat = (this.defeat > 0 ? parseFloat(results.length / this.defeat).toFixed(2) : 0)
      return ''
    }
  }
}
</script>

<style scoped>

</style>
