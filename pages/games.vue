<template>
  <v-container fluid class="text-body-2">
    <h2 class="text-center purple--text">Игры</h2>

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
  },
  name: 'games',
  components: {
    MuGroupResult
  },
  computed: {
    ...mapGetters({
      groups: 'group/getGroups',
      groupsCount: 'group/getCountGroups',
      groupGames: 'game/getGroupGames'
    })
  },
}
</script>

<style scoped>

</style>
