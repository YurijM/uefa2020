<template>
  <div>
    <mu-title-page-admin title="Прогноз"/>

    <div class="text-center yellow--text">
      <h3>Прогноз на ближайшую игру</h3>
      <h4>{{ nearDate }}</h4>
      <h4>{{ game }}</h4>
    </div>

    <v-data-table
      dense
      class="mt-5 grey darken-3 mx-auto"
      :style="{maxWidth: '200px'}"
      :headers="headers"
      :items="stakes"
      items-per-page="50"
      :hide-default-footer="true"
    />
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import MuTitlePageAdmin from '~/components/TitlePageAdmin'

export default {
  name: 'stakes',
  layout: 'admin',
  components: {
    MuTitlePageAdmin
  },
  async asyncData({store}) {
    await store.dispatch('game/loadGames');
    await store.dispatch('stake/loadStakesNear');
  },
  data() {
    return {
      loading: false,
      headers: [
        {text: 'Игрок', value: 'nickname'},
        {text: 'Прогноз', align: 'center', value: 'result'},
      ],
      nearGame: null,
      nearDate: null,
      game: ''
    }
  },
  created() {
    this.nearGame = this.games.find(g => (new Date()) < (new Date(g.start)))
    const date = new Date(this.nearGame.start)
    this.nearDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
    this.game = `${this.nearGame.team1} - ${this.nearGame.team2}`
  },
  computed: {
    ...mapGetters({
      games: 'game/getGames',
      stakes: 'stake/getStakesNear'
    }),
  },
}
</script>

<style lang="scss" scoped>

</style>
