<template>
  <div>
    <mu-title-page-admin title="Игроки"/>

    <v-dialog v-model="dialog" max-width="300px">
      <v-card>
        <v-card-title class="dark blue-grey darken-3 pa-3 text-body-1">
          <!--<v-img :src="`/photo/${editedItem.photo}`"/>-->
          <v-avatar width="40" height="40" class="mr-3">
            <img
              :src="`/photo/${editedItem.photo}`"
              :alt="editedItem.nickname"
            >
          </v-avatar>
          <!--<v-spacer></v-spacer>-->
          {{ `${editedItem.fullName}` }}
        </v-card-title>

        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-card-text
            class="grey darken-3 pt-2 pb-0"
            :style="{borderTop: '1px #eee solid !important', borderBottom: '1px #eee solid !important'}"
          >
            <v-text-field
              v-model="editedItem.stake"
              autofocus
              label="Ставка"
              :rules="[rules.isNumber]"
            />

            <v-text-field
              v-model="editedItem.points"
              label="Очки"
              :rules="[rules.isNumber, rules.precision]"
            />

            <v-select
              :disabled="editedItem.id === gambler.id"
              v-model="editedItem.status"
              :items="statuses"
              label="Статус"
            />

            <v-switch
              :disabled="editedItem.id === gambler.id"
              v-model="editedItem.admin"
              flat
              :label="`Администратор: ${editedItem.admin ? 'Да' : 'Нет'}`"
            />
          </v-card-text>
        </v-form>

        <v-card-actions class="dark blue-grey darken-3 py-2 px-5">
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="close">Отмена</v-btn>
          <v-btn
            color="success"
            text
            :loading="loading"
            @click="save"
          >
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-data-table
      dense
      class="mt-5 grey darken-3 mx-auto"
      :style="{maxWidth: '750px', lineHeight: '45px'}"
      :headers="headers"
      :items="gamblers"
      :footer-props="{
        itemsPerPageAllText: 'Все',
        itemsPerPageOptions: [10, -1],
        itemsPerPageText: 'Строк на странице',
        pageText: '{0}-{1} из {2}'
      }"
    >
      <template v-slot:item.photo="{item}">
        <!--<v-img height="40" width="40" :src="`/photo/${item.photo}`"/>-->
        <v-avatar size="40" color="yellow">
          <img
            :src="`/photo/${item.photo}`"
            :alt="item.nickname"
          >
        </v-avatar>
      </template>

      <template v-slot:item.status="{item}">
        {{ statuses.find(s => s.value === item.status).text }}
      </template>

      <template v-slot:item.admin="{item}">
        {{ item.admin === 1 ? 'Да' : 'Нет' }}
      </template>

      <template v-slot:item.actions="{item}">
        <v-icon small @click="editItem(item)">fas fa-pen</v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import MuTitlePageAdmin from '~/components/TitlePageAdmin'
import {mapActions, mapGetters} from 'vuex'

export default {
  name: 'gamblers',
  layout: 'admin',
  components: {
    MuTitlePageAdmin
  },
  data() {
    return {
      dialog: false,
      valid: true,
      headers: [
        {text: '', value: 'photo', width: '1%'},
        {text: 'Участник', value: 'fullName'},
        {text: 'Ставка', align: 'center', value: 'stake', sortable: false},
        {text: 'Очки', align: 'center', value: 'points', sortable: false},
        {text: 'Место', align: 'center', value: 'place', sortable: false},
        {text: 'Статус', align: 'center', value: 'status', sortable: false},
        {text: 'Администратор', align: 'center', value: 'admin', sortable: false},
        {text: '', align: 'center', value: 'actions', sortable: false, width: '1%'}
      ],
      editedIndex: -1,
      editedItem: {
        stake: 0,
        points: 0.0,
        place: 0,
        status: 0,
        admin: 0
      },
      statuses: [
        {text: 'Исключён', value: -1},
        {text: 'Отправлено письмо', value: 0},
        {text: 'Зарегистрирован', value: 1}
      ],
      rules: {
        isNumber: value => (!isNaN(parseFloat(value)) && isFinite(value)) || 'Поле должно быть числом',
        precision: value => (!value.includes('.')) || (value.includes('.') && (value.split('.').pop().length < 2)) ||
          'Десятичных знаков не должно быть больше 2'
      },
      loading: false
    }
  },
  watch: {
    dialog(val) {
      val || this.close()
    },
  },
  computed: {
    ...mapGetters({
      getGambler: 'gambler/getGambler',
      getGamblers: 'gambler/getGamblers',
      getGamblersByName: 'gambler/getGamblersByName',
      isMessage: 'common/isMessage'
    }),
    gambler() {
      return this.getGambler
    },
    gamblers() {
      return this.getGamblersByName
    },
  },
  methods: {
    ...mapActions({
      saveFeatures: 'gambler/saveFeatures'
    }),
    editItem(item) {
      this.editedIndex = this.gamblers.indexOf(item)
      this.editedItem = Object.assign({}, item)
      // Запоминаем текущее количество очков
      this.editedItem.curPoints = this.editedItem.points

      this.dialog = true
    },
    close() {
      this.dialog = false
      /*this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })*/
    },
    async save() {
      if (!this.$refs.form.validate()) return;

      this.loading = true
      const changedPoints = this.editedItem.points !== this.editedItem.curPoints

      this.editedItem.admin = this.editedItem.admin ? 1 : 0;

      await this.saveFeatures({
        gambler: this.editedItem,
        changedPoints: changedPoints
      });

      //Если сохранение параметров прошло успешно
      if (!this.isMessage) {
        this.$socket.emit('changeGambler', {
          changedPoints: changedPoints,
          nickname: this.editedItem.nickname
        })
      }

      this.loading = false;

      this.close()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
