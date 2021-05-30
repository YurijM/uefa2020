<template>
  <div>
    <v-dialog v-model="viewCopacabana" max-width="700">
      <v-sheet class="px-3 py-1 teal lighten-4">
        <v-img src="history/2016/copacabana.jpg"/>
      </v-sheet>
    </v-dialog>

    <v-dialog v-model="viewRasul" max-width="700">
      <v-sheet class="px-3 py-1 teal lighten-4">
        <v-img src="history/2016/rasul.jpg"/>
      </v-sheet>
    </v-dialog>

    <v-dialog v-model="viewFrance" max-width="700">
      <v-sheet class="px-3 py-1 teal lighten-4">
        <v-img src="history/2016/france.jpg"/>
      </v-sheet>
    </v-dialog>

    <h3 class="text-center teal--text">История - сайт 2016 год - чемпионат Европы во Франции</h3>

    <div class="history-bg mt-1 mx-1 mb-3">
      <div class="px-3 pb-2">
        <v-row dense class="header">
          <v-col cols="3">
            <v-img src="history/2016/super-victor2.png"/>
          </v-col>
          <v-col cols="6">
            <v-img src="history/2016/euro.png"/>
          </v-col>
          <v-col cols="3">
            <v-img src="history/2016/super-victor3.png"/>
          </v-col>
        </v-row>

        <h3 class="text-center">Д р у з ь я !</h3>

        <p>
          Два года назад мы совершили незабываемое путешествие в Бразилию!
        </p>

        <p>
          Посмотрели захватывающие футбольные матчи, позагорали и покупались в Атлантическом океане,
          <span class="anchor indigo--text" @click="viewCopacabana = true">сами поиграли в футбол,</span>
          на пляже Копакабана. А
          <span class="anchor indigo--text" @click="viewRasul = true">некоторым</span>
          из нас удалось сделать удачные ставки на тотализаторе и пополнить свой бюджет!
        </p>

        <p>
          В этот раз предлагаю посетить
          <span class="anchor indigo--text" @click="viewFrance = true">Францию</span>
          и вновь увлекательно провести время, наслаждаясь футболом. И, конечно же, снова рискнуть и сыграть на тотализаторе!
        </p>
        <p>
          Потенциальному участнику нашего проекта я вышлю письмо со ссылкой для регистрации, и после её успешного прохождения Вы попадёте в атмосферу праздника и азарта!
        </p>

        <h3 class="text-center">Всем удачи и до встречи во Франции!</h3>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'History2016',
  data() {
    return {
      viewCopacabana: false,
      viewRasul: false,
      viewFrance: false
    }
  }
}
</script>

<style lang="scss" scoped>
.history-bg {
  background: linear-gradient(to left, rgba(150, 200, 150, 1),
    rgba(225, 240, 225, 1),
    rgba(225, 240, 225, 1),
    rgba(150, 200, 150, 1));
}

.anchor {
  text-decoration: underline;
  cursor: pointer;
}
</style>
