<template>
  <div>
    <h4>{{ group }}</h4>

    <v-simple-table
      dense
      class="pb-1 mt-1"
      :style="{backgroundColor: '#e3ccea', border: '1px solid purple'}"
    >
      <template v-slot:default>
        <thead>
        <tr>
          <th class="text-center">Команда</th>
          <th v-for="i in 4" :key="i" class="text-center" width="10%">
            {{ i }}
          </th>
          <th class="text-center">В</th>
          <th class="text-center">Н</th>
          <th class="text-center">П</th>
          <th class="text-center">Мячи</th>
          <th class="text-center">О</th>
          <th class="text-center">М</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="team in result" :key="team.order">
          <td>
            <div class="d-flex align-center">
              <v-img class="mr-1" max-width="25" :src="`/flags/${team.flag}`"/>
              {{ team.team }}
            </div>
          </td>
          <td
            v-for="i in 4"
            :key="i"
            class="text-center"
            :style="{backgroundColor: team.order === i ? 'grey' : ''}"
          >
            <div v-if="team.order !== i">
              {{ team.games.find(g => g.order === i).scope }}
            </div>
          </td>
          <td class="text-center red--text">{{ team.win }}</td>
          <td class="text-center green--text">{{ team.draw }}</td>
          <td class="text-center blue--text">{{ team.defeat }}</td>
          <td class="text-center">{{ `${team.balls1}-${team.balls2}` }}</td>
          <td class="text-center font-weight-bold">{{ team.points }}</td>
          <td
            class="text-center"
            :class="team.place < 3 ? 'red--text' : ''"
          >
            {{ team.place }}
          </td>
        </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
export default {
  name: 'GroupResult',
  props: {
    group: {
      type: String,
      default: ''
    },
    result: {
      type: Array,
      default: []
    }
  }
}
</script>

<style scoped>

</style>
