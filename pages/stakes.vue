<template>
  <div class="mx-auto" :style="{ width: '100%' }">
    <h2 class="text-center mt-1 teal--text">Ставки</h2>

    <v-alert
      v-if="groupStakes.length || playoffStakes.length"
      dense
      border="top"
      colored-border
      color="teal"
      elevation="2"
      class="mb-1 mx-auto"
      :style="{ fontSize: '.9em', maxWidth: widthTable }"
    >
      На данной странице отображаются
      <span class="teal--text text--darken-3"><strong>только</strong></span> игры, которые
      <span class="teal--text text--darken-3"><strong>ещё не начались</strong></span>.<br/>
      На игры, которые
      <span class="teal--text text--darken-3"><strong>уже начались или закончились</strong></span>,
      ставки сделать <span class="teal--text text--darken-3"><strong>нельзя</strong></span>.
    </v-alert>

    <v-alert
      v-else
      dense
      border="top"
      color="red"
      dark
      elevation="2"
      class="mt-3 pa-5 mx-auto text-center"
      :style="{ fontSize: '1.25em', maxWidth: widthEnding }"
    >
      {{ ending.message }}
    </v-alert>

    <div v-if="groupStakes.length > 0">
      <mu-group-stakes :maxWidth="widthTable" />
    </div>

    <div v-if="playoffStakes.length > 0">
      <mu-playoff-stakes :maxWidth="widthTable" />
    </div>
  </div>
</template>

<script>
import {mapMutations, mapGetters} from "vuex"
import MuGroupStakes from '../components/GroupStakes'
import MuPlayoffStakes from '../components/PlayoffStakes'

export default {
  name: 'stakes',
  components: {
    MuGroupStakes,
    MuPlayoffStakes
  },
  async asyncData({store}) {
    await store.dispatch('group/loadGroups');
    await store.dispatch('team/loadTeams')
    await store.dispatch('game/loadGames')

    const gamblerId = store.getters['gambler/getGambler'].id
    const order = store.getters['group/getCountGroups']
    await store.dispatch('stake/loadStakes', {
      gambler_id: gamblerId,
      order,
      source: 'group',
    });
    await store.dispatch('stake/loadStakes', {
      gambler_id: gamblerId,
      order,
      source: 'playoff',
    });
  },
  computed: {
    ...mapGetters({
      groupStakes: 'stake/getStakesGroups',
      playoffStakes: 'stake/getStakesPlayoff',
      getGambler: 'gambler/getGambler',
      ending: 'ending/getEnding'
    }),
    widthTable() {
      switch (this.$vuetify.breakpoint.name) {
        case "lg":
          return "80%";
        case "xl":
          return "60%";
        default:
          return "95%";
      }
    },
    widthEnding() {
      switch (this.$vuetify.breakpoint.name) {
        case "xl":
          return "40%";
        case "lg":
          return "50%";
        case "md":
          return "60%";
        case "sm":
          return "70%";
        case "xs":
          return "80%";
        default:
          return "95%";
      }
    }, },
  methods: {
    ...mapMutations({
      clearMessage: "common/CLEAR_MESSAGE",
      setMessage: "common/SET_MESSAGE",
    }),
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${day}.${month}.${year}`;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
