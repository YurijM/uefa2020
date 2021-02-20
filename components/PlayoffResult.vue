<template>
  <v-row dense>
    <v-col cols="12" class="text-center">
      <h4>Результаты сыгранных командами матчей</h4>
    </v-col>

    <v-col v-for="(team, i) in teams" :key="i" cols="6">
      <v-simple-table
        dense
        :style="{backgroundColor: '#e3ccea', border: '1px solid grey'}"
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
            <td class="text-right" width="75%">{{ game.team1 }}-{{ game.team2 }}</td>
            <td class="font-weight-bold" width="25%">{{ game.goal1 }}:{{ game.goal2 }}</td>
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
