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
            <!--<v-container>
              <v-row>
                <v-col class="py-0" cols="12" sm="6">
                  <v-text-field v-model="editedItem.points" label="Очки"/>
                </v-col>

                <v-col class="py-0" cols="12" sm="6">
                  <v-select
                    v-model="editedItem.status"
                    :items="statuses"
                    label="Статус"
                  ></v-select>
                </v-col>

                <v-col class="py-0" cols="12">
                  <v-switch v-model="editedItem.admin" flat :label="`Администратор: ${editedItem.admin ? 'Да' : 'Нет'}`"></v-switch>
                </v-col>
              </v-row>
            </v-container>-->
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
      class="mt-2 grey darken-3 mx-auto"
      :style="{maxWidth: '700px'}"
      :headers="headers"
      :items="gamblers"
      :footer-props="{
        itemsPerPageAllText: 'Все',
        itemsPerPageOptions: [15, 25, -1],
        itemsPerPageText: 'Количество строк на странице',
        pageText: '{0}-{1} из {2}'
      }"
    >
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
        {text: 'Участник', value: 'fullName'},
        {text: 'Очки', align: 'center', value: 'points', sortable: false},
        {text: 'Пред.место', align: 'center', value: 'prev_place', sortable: false},
        {text: 'Статус', align: 'center', value: 'status', sortable: false},
        {text: 'Администратор', align: 'center', value: 'admin', sortable: false},
        {text: '', align: 'center', value: 'actions', sortable: false, width: '1%'}
      ],
      editedIndex: -1,
      editedItem: {
        points: 0.0,
        prev_place: 0,
        status: 0,
        admin: 0
      },
      defaultItem: {
        points: 0.0,
        prev_place: 0,
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
      this.dialog = true
    },
    close() {
      this.dialog = false
      /*this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })*/
    },
    /*save() {
      if (this.editedIndex > -1) {
        console.log('editedItem:', this.editedItem);
        console.log('editedIndex:', this.editedIndex);
        Object.assign(this.gamblers[this.editedIndex], this.editedItem)
      } else {
        this.gamblers.push(this.editedItem)
      }
      this.close()
    },*/
    async save() {
      if (!this.$refs.form.validate()) return;

      this.loading = true;

      this.editedItem.admin = this.editedItem.admin ? 1 : 0;

      console.log('place:', this.editedItem.place)
      await this.saveFeatures(this.editedItem);

      this.loading = false;

      this.close()

      //Если сохранение профиля прошло успешно
      if (!this.isMessage) {
        const gamblers = this.getGamblers;
        if (gamblers.some(e => e.prev_place !== e.place)) {
          this.$socket.emit('changePlaces', gamblers)
        }
      }
    }
  }
}
</script>

<style lang="scss">
.v-application--is-ltr .v-data-footer__select .v-select {
  margin: 10px 0 10px 10px !important;
}

.v-application--is-ltr .v-data-footer__select {
  margin-right: 0;
}

.v-application--is-ltr .v-data-footer__pagination {
  margin: 0 10px;
}

.v-application--is-ltr .v-data-footer__icons-before .v-btn:last-child {
  margin-right: 5px;
}

.v-btn--icon.v-size--default {
  height: 36px;
  width: 10px;
}
</style>
