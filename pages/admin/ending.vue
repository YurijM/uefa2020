<template>
  <div>
    <mu-title-page-admin title="Окончание турнира"/>

    <v-card class="mx-auto mt-3" color="grey darken-3" max-width="500">
      <v-card-actions class="flex-column">
        <v-switch
          v-model="ending.finish"
          flat
          :label="`Турнир закончился: ${ending.finish ? 'да' : 'нет'}`"
        />

        <v-textarea
          label="Сообщение о победителе"
          v-model="ending.message"
          color="yellow"
          rows="2"
          autofocus
          :style="{width: '100%'}"
        />

        <v-btn
          class="mt-2"
          :loading="loading"
          :disabled="loading"
          @click="save"
        >
          Сохранить
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import MuTitlePageAdmin from '~/components/TitlePageAdmin'

export default {
  name: 'ending',
  layout: 'admin',
  components: {
    MuTitlePageAdmin
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {
    ...mapGetters({
      getEnding: 'ending/getEnding',
      isMessage: 'common/isMessage'
    }),
    ending() {
      return Object.assign({}, this.getEnding)
    }
  },
  methods: {
    ...mapActions({
      updateEnding: 'ending/updateEnding'
    }),
    async save() {
      this.loading = true

      this.ending.finish = this.ending.finish ? 1 : 0;
      await this.updateEnding(this.ending);

      //Если сохранение прошло успешно
      if (!this.isMessage) {
        this.$socket.emit('changeEnding', this.ending)
      }

      this.loading = false;
    }
  }
}
</script>

<style scoped>

</style>
