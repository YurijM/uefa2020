<template>
  <div class="container">
    <h4 class="text-center">Коэффициенты на результаты</h4>

    <div class="text-body-2">
      <h4>Правила расчёта коэффициетов</h4>
      <p>
        Подсчитывается количество ставок на каждый возможный исход для конкретной игры и делится на количество
        игроков.
      </p>
      <p>
        Коэффициент за отсутствие ставки - это отрицательное среднее значение всех коэффициентов на данную игру,
        делённое на <b>2</b>.
      </p>
    </div>

    <v-simple-table dense class="purple lighten-5">
      <template v-slot:default>
        <thead>
        <tr>
          <th class="text-center">игра</th>
          <th class="text-center">победа</th>
          <th class="text-center">ничья</th>
          <th class="text-center">поражение</th>
          <th class="text-center">нет ставки</th>
        </tr>
        </thead>
        <tbody>
        <tr
          v-for="game in getGames"
          :key="game.id"
          class="text-center"
        >
          <td>{{ game.id }}</td>
          <td class="font-weight-bold error--text">{{ game.points.winPoints }}</td>
          <td class="font-weight-bold success--text">{{ game.points.drawPoints }}</td>
          <td class="font-weight-bold primary--text">{{ game.points.defeatPoints }}</td>
          <td class="font-weight-bold">-{{ game.points.avgPoints }}</td>
        </tr>
        </tbody>
      </template>
    </v-simple-table>

    <h4 class="text-center mt-2">Результаты игр</h4>

    <v-row class="mb-2">
      <v-col
        v-for="game in getGames"
        :key="game.id"
        class="text-center py-0 font-weight-bold"
        :class="game.goal1 > game.goal2 ? 'error--text' : game.goal1 == game.goal2 ? 'success--text' : ''"
      >
        {{ game.goal1 }} : {{ game.goal2 }}
      </v-col>
    </v-row>

    <h4 class="text-center">Ставки</h4>

    <div class="text-body-2 mb-2">
      <h4>Правила расчёта очков:</h4>

      <ul type="disk">
        <li>
          если ставка не сделана, то назначается штраф, равный отрицательному среднему значению всех коэффициентов
          на данную игру, делённому на <b>2</b>;
        </li>
        <li>
          если угадан счёт, то коэффициент на данный исход умножается на <b>2</b>;
        </li>
        <li>
          если не ничья и угадана разница мячей, то коэффициент на данный исход умножается на <b>1.25</b>;
        </li>
        <li>
          если угадан исход (победа, ничья, поражение), то количество очков равно коэффициенту на данный исход;
        </li>
        <li>
          если угадан исход и угадано количество забитых или пропущенных мячей, то коэффициент на данный исход
          умножается на <b>1.1</b>;
        </li>
        <li>
          если исход не угадан, но угадано количество забитых или пропущенных мячей, то количество очков равно
          <b>0.15</b>
        </li>
      </ul>
    </div>

    <v-simple-table dense class="purple lighten-5">
      <template v-slot:default>
        <thead>
        <tr>
          <th class="text-center" rowspan="2">
            Игрок
          </th>
          <th class="text-center" rowspan="2">
            Взнос
          </th>
          <th v-for="game in getGames" class="text-center" colspan="2">
            {{ game.id }}-я игра
          </th>
          <th class="text-center" rowspan="2">Итого</th>
        </tr>
        <tr>
          <template v-for="i in getGames.length">
            <th class="text-center">Счёт</th>
            <th class="text-center">Очки</th>
          </template>
        </tr>
        </thead>
        <tbody>
        <tr
          v-for="gambler in getGamblers"
          :key="gambler.gambler"
        >
          <td>{{ gambler.gambler }}</td>
          <td class="text-center">{{ gambler.summa }}</td>
          <template
            v-for="stake in gambler.stakes"
          >
            <td v-if="stake.goal1 !== ''" class="text-center">{{ stake.goal1 }} : {{ stake.goal2 }}</td>
            <td v-else class="text-center font-weight-bold">нет</td>
            <td class="text-center primary--text font-weight-bold">
              {{ gambler.result[stake.game_id - 1].points }}
            </td>
          </template>
          <td class="text-center red--text font-weight-bold">{{ sum[gambler.id - 1] }}</td>
        </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'

export default {
  name: "rules",
  data() {
    return {}
  },
  mounted() {
    this.loadSumma({min: 300, max: 1000})
    this.loadStakes()
    this.loadGames({min: 0, max: 3})
    this.calcGamePoints()
    this.calcResult()
  },
  computed: {
    ...mapGetters({
      getGamblers: 'example/getGamblers',
      getGames: 'example/getGames'
    }),
    sum() {
      let result = []

      this.getGamblers.forEach(g => {
        let points = 0
        g.result.forEach(r => points += r.points)
        result.push(parseFloat(points.toFixed(2)))
      })

      return result
    }
  },
  methods: {
    ...mapMutations({
      loadSumma: 'example/LOAD_SUMMA',
      loadStakes: 'example/LOAD_STAKES',
      loadGames: 'example/LOAD_GAMES',
      calcGamePoints: 'example/CALC_GAME_POINTS',
      calcResult: 'example/CALC_RESULT'
    })
  }
}
</script>

<style lang="scss" scoped>
p {
  margin-bottom: .25em;
}
.v-list--dense .v-list-item {
  min-height: auto !important;
}

.v-list-item__content {
  padding: 0 !important
}
</style>
