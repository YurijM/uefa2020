<template>
  <div>
    <h3 class="text-center mt-1">Коэффициенты на результаты</h3>

    <h4>Правила расчёта коэффициетов</h4>

    <p>
      Подсчитывается количество ставок на каждый возможный исход для конкретной игры и делится на количество
      игроков.
    </p>
    <p>
      Коэффициент за отсутствие ставки - это отрицательное среднее значение всех коэффициентов на данную игру,
      делённое на <b>2</b>.
    </p>

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

    <h4>Дополнительно для игр плэйофф:</h4>

    <ul type="disk">
      <li>
        если угадан счёт в дополнительное время, то добавляется <b>2 очка</b>;
      </li>
      <li>
        если в дополнительное время зафиксирована не ничья и угадана разница мячей, то добавляется <b>1.25
        очка</b>;
      </li>
      <li>
        если угадан исход игры (победа, ничья, поражение) в дополнительное время, то добавляется <b>1 очко</b>;
      </li>
      <li>
        если угадано количество забитых или пропущенных мячей, то добавляется ещё <b>0.1 очка</b>.
      </li>
    </ul>

    <div class="d-flex align-center justify-space-between my-2">
      <v-btn
        outlined
        small
        @click="toCalculate"
      >
        <v-icon left>far fa-clipboard</v-icon>
        {{ isCalced ? 'Обновить данные' : 'Пример' }}
      </v-btn>

      <h4 class="ml-2">Коэффициенты на результаты</h4>
    </div>

    <v-simple-table
      v-if="isCalced"
      dense
      :style="{backgroundColor: '#e3ccea', border: '1px solid purple'}"
    >
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
          v-for="game in games"
          v-if="game.id <= countGroupGames"
          :key="game.id"
          class="text-center"
        >
          <td>
            {{ game.id }}
            <span v-if="game.id > countGroupGames">
              (плэйофф)
            </span>
          </td>
          <td class="font-weight-bold deep-orange--text text--accent-4">{{ game.points.winPoints }}</td>
          <td class="font-weight-bold green--text text--darken-4">{{ game.points.drawPoints }}</td>
          <td class="font-weight-bold light-blue--text text--darken-4">{{ game.points.defeatPoints }}</td>
          <td class="font-weight-bold">-{{ game.points.avgPoints }}</td>
        </tr>

        <tr>
          <th class="text-center" colspan="5">. . .</th>
        </tr>

        <tr
          v-for="game in games"
          v-if="game.id > countGroupGames"
          :key="game.id"
          class="text-center"
        >
          <td>
            {{ game.id }}
            <span v-if="game.id > countGroupGames">
              (плэйофф)
            </span>
          </td>
          <td class="font-weight-bold deep-orange--text text--accent-4">{{ game.points.winPoints }}</td>
          <td class="font-weight-bold green--text text--darken-4">{{ game.points.drawPoints }}</td>
          <td class="font-weight-bold light-blue--text text--darken-4">{{ game.points.defeatPoints }}</td>
          <td class="font-weight-bold">-{{ game.points.avgPoints }}</td>
        </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: "ExampleGameCoefficient",
  props:{
    isCalced: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      games: 'example/getGames',
      countGroupGames: 'example/getCountGroupGames'
    })
  },
  methods: {
    toCalculate() {
      this.$emit('calculate')
    }
  }
}
</script>

<style scoped>

</style>
