<template>
  <div>
    <v-dialog v-model="viewStudents" max-width="450">
      <v-sheet class="px-3 py-1 teal lighten-4">
        <v-img src="history/2018/students.png"/>
      </v-sheet>
    </v-dialog>

    <v-dialog v-model="viewJackson" max-width="250">
      <v-sheet class="px-3 py-1 teal lighten-4">
        <v-img src="history/2018/jackson.png"/>
      </v-sheet>
    </v-dialog>

    <v-dialog v-model="viewMarina" max-width="250">
      <v-sheet class="px-3 py-1 teal lighten-4">
        <v-img src="history/2018/marina.png"/>
      </v-sheet>
    </v-dialog>

    <v-dialog v-model="viewTeam" max-width="850">
      <v-sheet class="px-3 py-1 teal lighten-4">
        <v-img src="history/2018/team.jpg"/>
      </v-sheet>
    </v-dialog>

    <h3 class="text-center teal--text">История - сайт 2018 год - чемпионат мира в России</h3>

    <div class="history-bg mt-1 mx-1 mb-3">
      <div class="history px-3 pt-1 pb-2">
        <v-row class="header">
          <v-col cols="3">
            <v-img src="history/2018/russia-300.png"/>
          </v-col>
          <v-col cols="6">
            <v-img src="history/2018/tote.png"/>
          </v-col>
          <v-col cols="3">
            <v-img src="history/2018/zabivaka-300.png"/>
          </v-col>
        </v-row>

        <h3 class="text-center">Д р у з ь я !</h3>

        <p>
          Время летит стремительно!
        </p>
        <p>
          Совсем недавно мы переживали за нашу сборную на чемпионате Европы; делали смелые и неожиданные ставки;
          радовались и огорчались... А вот уже совсем скоро
          стартует турнир, который мы так долго ждали - <b>чемпионат мира по футболу в России</b>!
        </p>
        <p>
          Надеюсь, что некоторым из нас посчастливится посетить игры и "в живую" насладиться атмосферой праздника на
          стадионе.
        </p>
        <p>
          Пожелаем сборной России успешно выступить на этом домашнем чемпионате!
        </p>
        <p>
          Ну а мы давайте снова сыграем на <b>нашем тотализаторе</b>!
        </p>
        <p>
          Идея провести свой тотализатор зародилась в далёком уже <b>1982 году</b>.
        </p>

        <p>
          На тот момент <span class="anchor indigo--text" @click="viewStudents = true">мы были студентами</span> 4-го курса факультеты автоматики и
          вычислительной техники <b>Киевского института инженеров гражданской авиации</b>.
        </p>

        <p>
          <span class="anchor indigo--text" @click="viewJackson = true">Один из нас</span> предложил провести турнир по предсказанию результатов
          футбольных встреч. Не помню уже, что за игры это были (возможно Кубок чемпионов, Кубок кубков и Кубок УЕФА). По-моему, решили
          ограничиться только текущей стадией Кубков и играми с участием советских команд.
        </p>
        <p>
          Назвали тотализатор <b>"Пивной"</b>. По окончании все, кроме победителя, скинулись (чем ниже место, тем больше взнос), купили пиво и
          дружно отметили завершение нашего турнира.
        </p>

        <p>
          Документ, в котором фиксировались результаты тотализатора, был художественно оформлен нашей
          <span class="anchor indigo--text" @click="viewMarina = true">однокурсницей</span>. Очень жаль, но данный раритет утерян! Изготовлен он
          был из листа альбома для рисования, сложенного пополам. Точно помню, что на лицевой стороне была нарисована (фломастерами!) пивная кружка
          с пенной шапкой и что-то ещё на футбольную тему.
        </p>
        <p>
          В <b>90-х</b> я стал проводить тотализатор в кругу семьи. С каждым следующим турниром всё больше использовались информационные
          технологии. Если сначала результаты фиксировались на бумажном носителе, то к началу <b>21 века</b> это была уже таблица <b>Excel</b>,
          которая автоматический формировала турнирную таблицу.
        </p>

        <p>
          В <b>2010 году</b> была создана первая <b>Internet-версия</b>, в которой уже приняли участие не только члены семьи, но и родственники, и
          знакомые. С каждым последующим футбольным турниром <span class="anchor indigo--text" @click="viewTeam = true">число участников</span>
          постоянно увеличивалось.
        </p>
        <p>
          Неизменным остаётся то, что наш клуб <b>закрытый</b> <i class="far fa-smile fa-lg" aria-hidden="true"></i> &nbsp;: участников
          тотализатора определяют организаторы.
        </p>
        <p>
          По уже сложившейся традиции, потенциальному участнику нашего проекта я вышлю письмо со ссылкой для регистрации, и после её успешного
          прохождения вы будете следить за ходом чемпионата в компании увлечённых и азартных болельщиков!
        </p>
        <h3 class="text-center">
          Всем удачи и до встречи на российских стадионах!
        </h3>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'History2018',
  data() {
    return {
      viewStudents: false,
      viewJackson: false,
      viewMarina: false,
      viewTeam: false
    }
  },
}
</script>

<style lang="scss" scoped>
.header {
  background: linear-gradient(
      to right,
      rgba(223, 247, 255, 1),
      rgba(255, 255, 255, .2),
      rgba(255, 255, 255, .2),
      rgba(223, 247, 255, 1)
  ), linear-gradient(
      rgba(255, 255, 255, 1),
      rgba(255, 255, 255, 1) 30%,
      rgba(50, 190, 250, 1) 33.33%,
      rgba(50, 190, 250, 1) 63.33%,
      rgba(245, 83, 87, 1) 66.66%,
      rgba(245, 83, 87, 1)
  )
}

.history-bg {
  border-radius: 1em;
  background-image: url(../static/history/2018/bg.jpg);
  background-repeat: no-repeat;
  background-position: center center;
  background-attachment: fixed;
  webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}

.history {
  border-radius: 1em;
  background: linear-gradient(
      to right,
      rgba(208, 242, 255, .75),
      rgba(225, 241, 248, .6),
      rgba(225, 241, 248, .6),
      rgba(208, 242, 255, .75)
  );
}

.anchor {
  text-decoration: underline;
  cursor: pointer;
}
</style>
