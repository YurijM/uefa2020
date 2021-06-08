<template>
  <v-container fluid class="text-body-2">
    <h2 class="text-center teal--text">Правила</h2>

    <div v-if="gambler.status === 1">
      <h3 class="text-center">Денежный взнос</h3>

      <div class="text-body-2 mb-3">
        <p>
          Минимальная ставка для участия в тотализаторе <b>{{ minStake }} рублей</b>, максимальная - <b>{{ maxStake }} рублей</b>.
        </p>
        <p>
          Перечислить деньги Вы можете клиенту Сбербанка по телефону <b>928-264-52-40</b>
        </p>
        <p>
          После поступления денег на счёт Вы получите доступ к остальным страницам сайта.
        </p>

        <v-alert outlined color="red accent-4" dense :style="{backgroundColor: '#c5e2df !important'}">
          <v-row>
            <v-col
              align-self="center"
              class="text-center font-italic font-weight-bold py-0"
              :style="{fontSize: ($vuetify.breakpoint.name === 'xs' ? '1.1em'
                        : $vuetify.breakpoint.name === 'sm' ? '1.2em'
                        : $vuetify.breakpoint.name === 'md' ? '1.3em' : '1.4em'
                        )}"
            >
              {{ gambler.name }}, делайте свой взнос и становитесь полноценным участником!
            </v-col>
            <v-col class="text-center py-0">
              <img
                :src="gambler.sex === 'м' ? '/money-men.png' : '/money-women.png'"
                alt="Деньги"
              >
            </v-col>
          </v-row>
        </v-alert>
      </div>

      <hr>
    </div>

    <template v-else>
      <mu-example-game-coefficient :isCalced="isCalced" @calculate="calculate"/>

      <mu-example-games :isCalced="isCalced" @calculate="calculate"/>

      <mu-example-stakes :isCalced="isCalced" @calculate="calculate"/>

      <mu-example-result :isCalced="isCalced" @calculate="calculate"/>
    </template>
  </v-container>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex'
import MuExampleGameCoefficient from "../components/ExampleGameCoefficient"
import MuExampleGames from "../components/ExampleGames"
import MuExampleStakes from "../components/ExampleStakes"
import MuExampleResult from "../components/ExampleResult"

export default {
  name: 'rules',
  components: {
    MuExampleGameCoefficient,
    MuExampleGames,
    MuExampleStakes,
    MuExampleResult
  },
  data() {
    return {
      isCalced: false,
      recalculate: false,
      minStake: 300,
      maxStake: 1000,
    }
  },
  computed: {
    ...mapGetters({
      gambler: 'gambler/getGambler',
    }),
    toCalculate() {
      return this.recalculate;
    }
  },
  watch: {
    toCalculate(recalculate) {
      if (recalculate) this.loadExample()
    }
  },
  methods: {
    ...mapMutations({
      loadGames: 'example/LOAD_GAMES',
      loadStakes: 'example/LOAD_STAKES',
      loadSumma: 'example/LOAD_SUMMA',
      calcGamePoints: 'example/CALC_GAME_POINTS',
      calcResult: 'example/CALC_RESULT'
    }),
    ...mapActions({
      calcPlaces: 'example/calcPlaces',
    }),
    loadExample() {
      this.loadSumma({min: this.minStake, max: this.maxStake})
      this.loadGames({min: 0, max: 3})
      this.loadStakes()
      this.calcGamePoints()
      this.calcPlaces()
      this.calcResult()

      this.isCalced = true
      this.recalculate = false
    },
    calculate() {
      this.recalculate = true
    },
    close() {
      this.dialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
