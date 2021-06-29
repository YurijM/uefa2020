<template>
  <v-row dense>
    <v-col cols="12" class="text-center">
      <h4>Результаты сыгранных командами матчей</h4>
    </v-col>

    <v-col v-for="(team, i) in teams" :key="i" cols="12">
      <v-simple-table
        dense
        :style="{backgroundColor: '#c5e2df', border: '1px solid grey'}"
      >
        <template v-slot:default>
          <thead>
          <tr>
            <th
              class="text-center blue-grey lighten-3"
              :style="{borderBottom: '1px grey solid !important'}"
              colspan="2"
            >
              {{ team.team }}
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(game, j) in team.games" :key="j">
            <td class="text-right" width="35%">
              <span :class="team.team === game.team1 ? 'font-weight-bold' : ''">{{ game.team1 }}</span>
              -
              <span :class="team.team === game.team2 ? 'font-weight-bold' : ''">{{ game.team2 }}</span>
            </td>
            <td width="65%">
              <span class="font-weight-bold" :class="getColor(game, team.team)">
                {{ game.goal1 }}:{{ game.goal2 }}
              </span>
              <template v-if="game.addGoal1">
                , доп.время
                <span class="font-weight-bold" :class="getColor(game, team.team, 'add')">
                  {{ game.addGoal1 }}:{{ game.addGoal2 }}
                </span>
              </template>
              <template v-if="game.penaltyId">
                , по пенальти
                <span class="font-weight-bold" :class="(game.penaltyId === team.id ? 'red--text' : '')">
                  {{ game.penaltyTeam }}
                </span>
              </template>
            </td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'PlayoffResult',
  props: {
    teams: {
      type: Array,
      default: []
    }
  },
  methods: {
    getColor(game, team, type = '') {
      let color = ''
      let goal1 = 0
      let goal2 = 0

      if (game.team1 === team) {
        goal1 = (type === '' ? game.goal1 : game.addGoal1)
        goal2 = (type === '' ? game.goal2 : game.addGoal2)
      } else {
        goal1 = (type === '' ? game.goal2 : game.addGoal2)
        goal2 = (type === '' ? game.goal1 : game.addGoal1)
      }

      if (goal1 > goal2) {
        color = 'red--text'
      } else if (goal1 === goal2) {
        color = 'green--text'
      }

      return color
    },
  }
}
</script>

<style scoped>

</style>
