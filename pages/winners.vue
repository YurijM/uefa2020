<template>
  <div :style="{width: '100%'}">
    <h2 class="text-center my-2 purple--text">Победители</h2>
    <div class="d-flex flex-wrap flex-row justify-center px-1">
      {{ allStakes }}
      {{ avgStake }}
      <v-card
        v-for="(winner, i) in winners"
        :key="winner.gambler.id"
        min-width="175"
        outlined
        class="mb-1 dark blue-grey lighten-4"
        :class="(i > 0) ? 'ml-1' : ''"
        :style="{border: '2px solid ' + (winner.place == 1 ? 'red' : (winner.place == 2 ? 'green' : 'blue')) + ' !important'}"
      >
        <v-img
          lazy-src="/user.jpg"
          :src="`/photo/${winner.gambler.photo}`"
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
          class="pa-1 flex-column body-1 text-center"
          style="word-break: normal !important"
          :style="{borderTop: '2px solid ' + (winner.place == 1 ? 'red' : (winner.place == 2 ? 'green' : 'blue')) + ' !important'}"
        >
          <div>{{ winner.gambler.family }} {{ winner.gambler.name }}</div>
          <div>({{ winner.gambler.nickname }})</div>
          <div>({{ winner.gambler.stake }})</div>
          <div>({{ winner.points }})</div>
          <div>({{ winner.summa }})</div>
        </v-card-title>
      </v-card>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: 'winners',
  computed: {
    ...mapGetters({
      getResult: 'point/getResult',
      gamblers: 'gambler/getGamblers',
    }),
    allStakes() {
      return this.gamblers.reduce((sum, e) => sum + e.stake, 0)
    },
    avgStake() {
      return (this.gamblers.reduce((sum, e) => sum + e.stake, 0)) / this.gamblers.length
    },
    winners() {
      const result = this.getResult.filter(r => r.lastPlace <= 3)

      const win1 = result.filter(r => r.lastPlace == 1)
      const win2 = result.filter(r => r.lastPlace == 2)
      const win3 = result.filter(r => r.lastPlace == 3)

      const countWin1 = win1.length
      const countWin2 = win2.length
      const countWin3 = win3.length

      //const pointsWin1 = win1.reduce((points, e) => points + e.stake, 0)
      const pointsWin2 = win2.reduce((points, e) => points + e.points, 0)
      const pointsWin3 = win3.reduce((points, e) => points + e.points, 0)

      const countGamblers = this.gamblers.length

      let sumCoefs = 0
      let sumSums = 0
      let winners = []

      result.forEach((r) => {
        const gambler = this.gamblers.find(g => g.id === r.gambler_id)
        let coef = gambler.stake / this.avgStake

        let summa = 0

        switch (parseInt(r.lastPlace)) {
          case 1:
            summa = gambler.stake * (countGamblers / 3)
            if (countWin1 <= 2) {
              coef *= ((r.points - (countWin3 > 0 ? pointsWin3 : pointsWin2)) / 10 + 1)
            }
            break
          case 2:
            summa = gambler.stake * (countGamblers / 6)
            if (countWin2 === 1) {
              coef *= ((pointsWin2 - pointsWin3) / 10 + 1)
            }
            break
          case 3:
            summa = gambler.stake * (countGamblers / 12)
            break
        }

        winners.push({
          gambler,
          coef,
          summa,
          points: r.points,
          place: r.lastPlace
        })

        sumCoefs += coef
        sumSums += summa
      })

      const residual = (this.allStakes - sumSums) / sumCoefs

      winners.forEach(w => {
        w.summa = parseFloat(w.summa + w.coef * residual).toFixed(0)
      })

      return winners
    }
  }
}
</script>

<style scoped>

</style>
