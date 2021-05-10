<template>
  <v-container fluid class="text-body-2">
    <h2 class="text-center purple--text">Игры</h2>

    <div
      v-for="group of playoffGroups" :key="group.id"
      class="mx-auto"
      :style="{maxWidth: '650px'}"
    >
      <div v-if="playoff.filter(g => g.groupId === group.id).length > 0">
        <h4 class="mt-1 text-center">{{ group.group }}</h4>

        <v-simple-table
          dense
          class="pb-1 mt-1"
          :style="{backgroundColor: '#e3ccea', border: '1px solid purple'}"
        >
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-center">Дата</th>
              <th class="text-center" width="5%"></th>
              <th class="text-center" width="15%">Игра</th>
              <th class="text-center" width="5%"></th>
              <th class="text-center">Результат</th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="game in playoff.filter(g => g.groupId === group.id)" :key="game.id">
              <td class="text-center">
                {{ $moment(game.start).format('DD.MM.YYYY HH:mm') }}
              </td>
              <td class="text-right">
                  <v-img class="mr-1" max-width="25" :src="`/flags/${game.flag1}`"/>
              </td>
              <td class="text-center">
                {{ game.game }}
              </td>
              <td>
                <v-img class="mr-1" max-width="25" :src="`/flags/${game.flag2}`"/>
              </td>
              <td class="text-center">
                {{ game.result }}
              </td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </div>
    </div>

    <div
      v-for="group of groups.filter(g => g.order <= groupsCount)"
      :key="group.id"
      class="mx-auto"
      :style="{maxWidth: '550px'}"
    >
      <mu-group-result class="mb-2" :group="group.group" :result="groupGames(group.id)"/>
    </div>
  </v-container>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import MuGroupResult from '../components/GroupResult'

export default {
  async asyncData({store}) {
    await store.dispatch('group/loadGroups')
    await store.dispatch('team/loadTeams')
    await store.dispatch('game/loadGames')
    await store.dispatch('game/loadPlayoffGames')
  },
  name: 'games',
  components: {
    MuGroupResult
  },
  data() {
    return {
      headerPlayoff: [
        {text: 'Дата', value: 'start', align: 'center', sortable: false},
        {text: '', value: 'flag1', align: 'right', sortable: false},
        {text: 'Игра', value: 'game', align: 'center', sortable: false},
        {text: '', value: 'flag2', sortable: false},
        {text: 'Результат', value: 'result', align: 'center', sortable: false}
      ],
    }
  },
  computed: {
    ...mapGetters({
      groups: 'group/getGroups',
      groupsCount: 'group/getCountGroups',
      groupGames: 'game/getGroupGames',
      playoff: 'game/getPlayoffGames'
    }),
    playoffGroups() {
      return this.groups.filter(g => g.order > this.groupsCount)
      .sort((a, b) => {
        return a.order < b.order ? 1 : -1
      })
    }
  },
}
</script>

<style scoped>

</style>
