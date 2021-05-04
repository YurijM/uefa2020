<template>
  <div>
    <mu-title-page-admin title="Прогноз"/>

    <div class="mt-2 text-center yellow--text">
      <h4>Прогноз на {{ nearDate }}</h4>
    </div>

    <v-row justify="center">
      <v-col cols="auto" v-for="(stake, i) in stakes" :key="i">
        <h4 class="text-center yellow--text">{{ games[i].game }}</h4>
        <v-data-table
          dense
          class="mt-3 grey darken-3 mx-auto"
          :headers="headers"
          :items="stake"
          :items-per-page="50"
          :hide-default-footer="true"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import MuTitlePageAdmin from '~/components/TitlePageAdmin'

export default {
  name: 'stakes',
  layout: 'admin',
  components: {
    MuTitlePageAdmin
  },
  async asyncData({store}) {
    await store.dispatch('game/loadGames');
  },
  data() {
    return {
      loading: false,
      headers: [
        {text: 'Игрок', value: 'nickname'},
        {text: 'Прогноз', align: 'center', value: 'result'},
        {text: 'Доп. время', align: 'center', value: 'addResult'},
        {text: 'По пенальти', align: 'center', value: 'penaltyTeam'},
      ],
      nearDate: null,
      games: []
    }
  },
  created() {
    const dateStart = this.getGames.find(g => (new Date()) < (new Date(g.start))).start
    const date = new Date(dateStart)

    this.nearDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`

    let start = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}T${date.toLocaleTimeString()}`

    this.games = this.getGames.filter(g => g.start === dateStart).map((r) => {
      return {gameNo: r.game_no, game: `${r.team1} - ${r.team2}`}
    })

    this.loadStakes({start, gamesNo: this.games.map(g => g.gameNo)})
  },
  computed: {
    ...mapGetters({
      getGames: 'game/getGames',
      stakes: 'stake/getStakesNear'
    }),
  },
  methods: {
    ...mapActions({
      loadStakes: 'stake/loadStakesNear'
    })
  }
}
</script>

<style lang="scss" scoped>

</style>
