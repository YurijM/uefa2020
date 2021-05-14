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
            <td class="text-right" width="35%">{{ game.team1 }}-{{ game.team2 }}</td>
            <td class="font-weight-bold" width="65%">
              {{ game.goal1 }}:{{ game.goal2 }}<span v-if="game.addGoal1">, доп.время {{ game.addGoal1 }}:{{ game.addGoal2 }}</span><span v-if="game.penaltyId">, по пенальти {{ game.penaltyTeam }}</span>
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
  }
}
</script>

<style scoped>

</style>
