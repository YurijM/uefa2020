<template>
  <v-row justify="center" dense>
    <v-col cols="12" class="text-center">
      <h2 class="text-center mt-1 purple--text">Тотализатор</h2>
    </v-col>

    <v-col cols="12" class="text-body-1 text-center">
      Коэффициенты:
      <span class="red--text text--accent-4">на победу</span>,
      <span class="green--text text--darken-2">на ничью</span>,
      <span class="light-blue--text text--darken-4">на проигрыш</span>,
      <span class="gray--text text--darken-3">штраф</span>
    </v-col>

    <v-col
      cols="auto"
      v-for="(game, i) in games"
      :key="game.id"
      class="text-center"
    >
      <div class="text-body-1 font-weight-black">
        {{ game.group }}
      </div>

      <h5 class="text-center">
        {{ $moment(game.start).format('DD.MM.YYYY HH:mm') }}
      </h5>

      <div class="text-body-2 font-weight-black">
        {{ game.game }} {{ game.result }}
        <template v-if="game.addResult">
          доп. время - {{ game.addResult }}
          <template v-if="game.penaltyWin">
            по пенальти - {{ game.penaltyWin }}
          </template>
        </template>
      </div>

      <div class="text-body-2">
        (<span class="red--text text--accent-4">{{ coefs[i].win }}</span>,
        <span class="green--text text--darken-2">{{ coefs[i].draw }}</span>,
        <span class="light-blue--text text--darken-4">{{ coefs[i].defeat }}</span>,
        <span class="gray--text text--darken-3">{{ coefs[i].avg }}</span>)
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
      coefs: [],
    }
  },
  created() {
    this.loadCoefs()
  },
  computed: {
    ...mapGetters({
      games: 'totalizator/getGames',
      stakes: 'totalizator/getStakes'
    }),
  },
  methods: {
    loadCoefs() {
      const gameIds = this.games.map(g => g.id)

      gameIds.forEach(id => {
        let win = 0
        let draw = 0
        let defeat = 0
        let avg = 0

        const results = this.stakes(id).map(s => s.result)
        results.forEach(s => {
          let result = s.split(':')
          if (result[0] !== 'нет') {
            if (result[0] > result[1]) win++
            else if (result[0] < result[1]) defeat++
            else draw++
          }
        })

        win = (win > 0 ? results.length / win : 0)
        draw = (draw > 0 ? results.length / draw : 0)
        defeat = (defeat > 0 ? results.length / defeat : 0)
        avg = (win + defeat + draw) / 6

        this.coefs.push({
          id: id,
          avg: parseFloat(avg).toFixed(2),
          win: parseFloat(win).toFixed(2),
          draw: parseFloat(draw).toFixed(2),
          defeat: parseFloat(defeat).toFixed(2)
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
