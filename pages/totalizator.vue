<template>
  <v-row justify="center" dense>
    <v-col cols="12" class="text-center">
      <h2 class="text-center mt-1 purple--text">Тотализатор</h2>
    </v-col>

    <v-col
      cols="auto"
      v-for="game in games"
      :key="game.id"
      justify-center
      class="text-center text-body-2"
    >
      <div >
        {{ game.group }}
      </div>
      <div>
        {{ game.game }} {{ game.result}}
        <template v-if="game.addResult">
          доп. время - {{ game.addResult }}
          <template v-if="game.penaltyWin">
            по пенальти - {{ game.penaltyWin }}
          </template>
        </template>
      </div>

      <v-simple-table
        dense
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
            v-for="stake in game.stakes"
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
  computed: {
    ...mapGetters({
      games: 'totalizator/getGames',
    })
  }
}
</script>

<style scoped>

</style>
