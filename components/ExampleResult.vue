<template>
  <div>
    <h3 class="text-center my-2">
      Правила распределения призового фонда между победителями
    </h3>

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

    <ol class="mb-2">
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

    <div class="d-flex align-center justify-space-between my-2">
      <v-btn
        outlined
        small
        @click="toCalculate"
      >
        <v-icon left>far fa-clipboard</v-icon>
        {{ isCalced ? 'Обновить данные' : 'Пример' }}
      </v-btn>

      <h4>Результат</h4>
    </div>


    <v-sheet max-width="400" class="mx-auto">
      <v-simple-table
        v-if="isCalced"
        dense
        :style="{backgroundColor: '#e3ccea', border: '1px solid purple'}"
      >
        <template v-slot:default>
          <thead>
          <tr>
            <th class="text-center">Место</th>
            <th class="text-center">Игрок</th>
            <th class="text-center">Взнос</th>
            <th class="text-center">Кол-во очков</th>
            <th class="text-center">Выигрыш</th>
          </tr>
          </thead>
          <tbody>
          <tr
            v-for="gambler in gamblersByPoints"
            :key="gambler.gambler"
            :class="gambler.place === 1
          ? 'font-weight-bold deep-orange--text text--accent-4'
          : gambler.place === 2
          ? 'font-weight-bold green--text text--darken-4'
          : gambler.place === 3
          ? 'font-weight-bold light-blue--text text--darken-4' : ''"
          >
            <td class="text-center">{{ gambler.place }}</td>
            <td>{{ gambler.gambler }}</td>
            <td class="text-center">{{ gambler.summa }}</td>
            <td class="text-center">{{ gambler.points }}</td>
            <td v-if="gambler.place <= 3" class="text-center">
              {{ winners.find(e => e.id === gambler.id).summa }}
            </td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-sheet>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'ExampleResult',
  props: {
    isCalced: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      gamblers: 'example/getGamblers',
      gamblersByPoints: 'example/getGamblersByPoints',
      winners: 'example/getWinners'
      /*avgStake: 'example/getAvgStake',
      allStakes: 'example/getAllStakes',
      win1Count: 'example/getWin1Count',
      win2Count: 'example/getWin2Count',
      win3Count: 'example/getWin3Count',
      win1Points: 'example/getWin1Points',
      win2Points: 'example/getWin2Points',
      win3Points: 'example/getWin3Points',*/
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
