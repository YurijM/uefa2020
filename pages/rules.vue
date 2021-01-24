<template>
  <div class="container">
    <div v-if="getGambler.status === 1">
      <h3 class="text-center">Денежный взнос</h3>

      <div class="text-body-2 mb-3">
        <p>
          Минимальная ставка для участия в тотализаторе <b>{{ minStake }} рублей</b>, максимальная - <b>{{
            maxStake
          }} рублей</b> (кратность ставки <b>{{ stepStake }}</b> рублей).
        </p>
        <p>
          Перечислить деньги Вы можете клиенту Сбербанка по телефону <b>XXX-XXX-XX-XX</b>
        </p>
        <p>
          После поступления денег на счёт Вы получите доступ к остальным страницам сайта.
        </p>

        <h2 class="text-center deep-orange--text text--accent-4 font-italic">
          {{ getGambler.name }}, делайте свой взнос и становитесь полноценным участником!
        </h2>
      </div>

      <hr>
    </div>

    <h3 class="text-center mb-2">Правила начисления очков</h3>

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

    <v-simple-table dense :style="{backgroundColor: '#e3ccea'}">
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
          <td>
            {{ game.id }}
            <span v-if="game.id > getCountGroupGames">
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
    </div>

    <h3 class="text-center my-2">
      Пример начисления очков
    </h3>

    <h4 class="text-center mt-2">Результаты игр</h4>

    <v-row class="mb-2 align-center justify-center" :style="{width: '100%'}">
      <v-col
        cols="auto"
        v-for="(game) of getGames"
        :key="game.id"
        class="text-center py-0 font-weight-bold"
        :class="game.goal1 > game.goal2 ? 'deep-orange--text text--accent-4' : game.goal1 == game.goal2 ?
        'green--text text--darken-4' : 'light-blue--text text--darken-4'"
      >
        {{ game.goal1 }} : {{ game.goal2 }}
        <div v-if="game.id > getCountGroupGames" class="black--text text-caption">
          доп. время - {{ game.addGoal1 }} : {{ game.addGoal2 }}
        </div>
        <div v-if="game.penaltyId" class="black--text text-caption">
          по пенальти - {{ game.penaltyId }}-я команда
        </div>
      </v-col>
    </v-row>

    <h4 class="text-center mb-2">Ставки</h4>

    <v-simple-table dense :style="{backgroundColor: '#e3ccea'}">
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
            <span v-if="game.id > getCountGroupGames">
              <br>(плэйофф)
            </span>
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
            <td
              v-if="stake.goal1 !== ''"
              class="text-center"
              :width="stake.game_id > getCountGroupGames && stake.penaltyId ? '15%': ''"
            >
              {{ stake.goal1 }} : {{ stake.goal2 }}
              <div v-if="stake.game_id > getCountGroupGames && stake.goal1 === stake.goal2">
                {{ stake.addGoal1 }} : {{ stake.addGoal2 }}
              </div>
              <div v-if="stake.game_id > getCountGroupGames && stake.penaltyId">
                {{ stake.penaltyId }}-я команда
              </div>
            </td>
            <td v-else class="text-center font-weight-bold">нет</td>
            <td class="text-center primary--text font-weight-bold">
              {{ gambler.result[stake.game_id - 1].points }}
            </td>
          </template>
          <td class="text-center deep-orange--text text--accent-4 font-weight-bold">{{ sum[gambler.id - 1] }}</td>
        </tr>
        </tbody>
      </template>
    </v-simple-table>

    <h3 class="text-center my-2">
      Правила распределения призового фонда между победителями
    </h3>

    <div class="text-body-2">
      <p>
        Призовой фонд будет поделён между участниками, занявшими <b>три первых места</b>.
      </p>

      <p>
        Если количество игроков, занявших <b>1-е место</b>, более <b>2</b> человек, то второе и третье места не
        присуждаются.
      </p>

      <p>
        Если количество занявших <b>1-е место</b> равно <b>2</b>, то второе место не присуждается.
      </p>

      <p>
        Если количество игроков, занявших <b>2-е место</b>, более <b>1</b> человека, то третье место не
        присуждается.
      </p>

      <ol>
        <li>Сначала призовой фонд делится по следующим правилам:
          <ul type="disc">
            <li>
              <b>1-е место</b> забирает <b>(&lt;количество участников&gt; / 3)</b> частей своей ставки;
            </li>
            <li>
              <b>2-е место</b> забирает <b>(&lt;количество участников&gt; / 6)</b> частей своей ставки;
            </li>
            <li>
              <b>3-е место</b> забирает <b>(&lt;количество участников&gt; / 12)</b> частей своей ставки;
            </li>
          </ul>
        </li>
        <li>
          Сумму призового фонда, оставшуюся после <b>п.1 (остаток призового фонда)</b>, делим между призёрами,
          учитывая размер их первоначальной ставки и количество набранных очков.
          <p>
            Для каждого победителя рассчитываем <b>коэффициент</b> его ставки:
          </p>
          <ul type="disc">
            <li>
              &lt;средняя ставка&gt; = &lt;сумма призового фонда&gt; / &lt;количество участников&gt;
            </li>
            <li>
              <b>&lt;коэффициент ставки&gt;</b> = &lt;ставка участника&gt; / &lt;средняя ставка&gt;
            </li>
          </ul>
          Затем расчитанные коэффициенты увеличиваем в зависимости от количества очков, набранных игроком:
          <ul type="disc">
            <li>
              для <b>1 места</b>:
              <ul>
                <li>
                  если количество игроков, занявших <b>1 место</b>, больше <b>2-х</b>, то рассчитанные
                  коэффициенты для каждого игрока остаются <b>без изменения</b>;
                </li>
                <li>
                  если количество игроков, занявших <b>1 место</b>, не более <b>2-х</b>, то рассчитанные
                  коэффициенты для каждого игрока <b>умножаются</b> на дополнительный коэффициент:
                  <p class="ml-3">
                    <b>&lt;дополнительный коэффициент&gt;</b> = (&lt;количество очков за 1 место> - &lt;
                    количество очков за 3 место (если 3 место не присуждалось, то количество очков за 2 место)
                    &gt;) / 10 + 1
                  </p>
                </li>
              </ul>
            </li>
            <li>
              для <b>2 места</b>:
              <ul>
                <li>
                  если количество игроков, занявших <b>2 место</b>, больше <b>1-го</b>, то рассчитанные
                  коэффициенты для каждого игрока остаются <b>без изменения</b>;
                </li>
                <li>
                  если <b>2 место</b> занял только <b>один</b> игрок, то рассчитанный для него коэффициент
                  <b>умножается</b> на дополнительный коэффициент:
                  <p class="ml-3">
                    <b>&lt;дополнительный коэффициент&gt;</b> = (&lt;количество очков за 2 место&gt; - &lt;
                    количество очков за 3 место&gt;) / 10 + 1
                  </p>
                </li>
              </ul>
            </li>
            <li>
              для <b>3 места</b> дополнительный коэффициент <b>отсутствует</b>.
            </li>
          </ul>

          Окончательный коэффициет для каждого победителя:
          <p class="ml-3">
            <b>&lt;коэффициент&gt;</b> = &lt;коэффициент ставки&gt; * &lt;дополнительный коэффициент&gt;
          </p>

          Рассчитываем <b>дополнительную сумму</b> выигрыша для каждого победителя:
          <ul type="disc">
            <li>
              &lt;размер одной части остатка призового фонда&gt; = &lt;остаток призового фонда&gt; / &lt;сумма
              коэффициентов ставок призёров&gt;
            </li>
            <li>
              <b>&lt;дополнительная сумма выигрыша призёра&gt;</b> = &lt;коэффициент призёра&gt; * &lt;размер
              одной части остатка призового фонда&gt;
            </li>
          </ul>
        </li>
        <li>
          <b>Окончательный выигрыш</b> каждого призёра складывается из суммы <b>п.1</b> и дополнительной суммы
          <b>п.2</b>.
        </li>
      </ol>

      <p class="font-italic font-weight-black info--text mt-2">
        При окончательном определении выигранной суммы результаты вышеописанного расчёта будут округлены с
        точностью до 50 рублей.
      </p>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'

export default {
  name: "rules",
  data() {
    return {
      minStake: 300,
      maxStake: 1000,
      stepStake: 100
    }
  },
  mounted() {
    this.loadSumma({min: this.minStake, max: this.maxStake})
    this.loadStakes()
    this.loadGames({min: 0, max: 3})
    this.calcGamePoints()
    this.calcResult()
  },
  computed: {
    ...mapGetters({
      getGambler: 'gambler/getGambler',
      getGamblers: 'example/getGamblers',
      getGames: 'example/getGames',
      getCountGroupGames: 'example/getCountGroupGames'
    }),
    sum() {
      let result = []

      this.getGamblers.forEach(g => {
        let points = 0
        g.result.forEach(r => points += r.points)
        result.push(parseFloat(points.toFixed(2)))
      })

      /*console.log('result:', result)
      console.log('min:', Math.min.apply(null, result))
      console.log('max:', Math.max.apply(null, result))*/

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
