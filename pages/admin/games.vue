<template>
  <div>
    <mu-dialog-delete-record
      v-model="dialogDelete"
      :record="{
        title: 'игры',
        message: `${editedItem.team1} - ${editedItem.team2}`
      }"
      @deleteItem="deleteItem"
    />

    <mu-title-page-admin title="Игры" whatAdd="Добавить игру" @add="addItem"/>

    <v-dialog
      v-model="dialog"
      persistent
      max-width="300px"
    >
      <v-card>
        <v-card-title class="dark blue-grey darken-3 pa-3 text-body-1">
          {{ formTitle }}
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
              v-model="editedItem.game_no"
              autofocus
              type="number"
              label="Номер игры"
              color="yellow"
              :rules="[rules.rangeNo]"
            />

            <v-row>
              <v-col cols="6">
                <v-menu
                  ref="date"
                  v-model="dateOpen"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="editedItem.date"
                      label="Дата"
                      persistent-hint
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker locale="ru" v-model="dateCurrent" no-title @input="dateOpen = false"></v-date-picker>
                </v-menu>
              </v-col>

              <v-col cols="6">
                <v-menu
                  ref="time"
                  v-model="timeOpen"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="editedItem.time"
                      label="Время"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    />
                  </template>
                  <v-time-picker
                    v-if="timeOpen"
                    v-model="editedItem.time"
                    format="24hr"
                    @click:minute="$refs.time.save(editedItem.time)"
                  />
                </v-menu>
              </v-col>
            </v-row>

            <v-select
              :items="stadiums"
              v-model="editedItem.stadium_id"
              label="Стадион"
              color="yellow"
              :rules="[rules.required]"
            />

            <v-select
              :items="groups"
              v-model="editedItem.group_id"
              label="Группа"
              color="yellow"
              :rules="[rules.required]"
            />

            <v-row>
              <v-col cols="9">
                <v-select
                  :items="teams"
                  v-model="editedItem.team1_id"
                  label="Команда"
                  color="yellow"
                  :rules="[rules.required]"
                />
              </v-col>

              <v-col cols="3">
                <v-text-field
                  v-model="editedItem.goal1"
                  label="Голы"
                  color="yellow"
                  :rules="[rules.isNumber]"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="9">
                <v-select
                  :items="teams"
                  v-model="editedItem.team2_id"
                  label="Команда"
                  color="yellow"
                  :rules="[rules.required]"
                />
              </v-col>

              <v-col cols="3">
                <v-text-field
                  v-model="editedItem.goal2"
                  label="Голы"
                  color="yellow"
                  :rules="[rules.isNumber]"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-form>

        <v-card-actions class="dark blue-grey darken-3 py-2 px-5">
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="close()">Отмена</v-btn>
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
      class="mt-10 grey darken-3 mx-auto"
      :style="{maxWidth: '750px'}"
      :headers="headers"
      :items="games"
      no-data-text="Игры ещё не введены"
      :footer-props="{
        itemsPerPageAllText: 'Все',
        itemsPerPageOptions: [12, -1],
        itemsPerPageText: 'Строк на странице',
        pageText: '{0}-{1} из {2}'
      }"
    >
      <template v-slot:item.start="{item}">
        {{ formatDate(new Date(item.start).toISOString().substr(0, 10)) }}
        {{ new Date(item.start).toLocaleTimeString().substr(0, 5) }}
      </template>

      <template v-slot:item.team1="{item}">
        <div class="d-flex flex-row justify-center">
          <v-img class="flex-grow-0" :src="`/flags/${item.flag1}`" height="20" width="30"/>
          <div class="flex-grow-1 ml-1 text-left">{{ item.team1 }}</div>
        </div>
      </template>

      <template v-slot:item.team2="{item}">
        <div class="d-flex flex-row justify-center">
          <div class="flex-grow-1 mr-1 text-right">{{ item.team2 }}</div>
          <v-img class="flex-grow-0" :src="`/flags/${item.flag2}`" height="20" width="30"/>
        </div>
      </template>

      <template v-slot:item.result="{item}">
        {{ item.goal1 }} - {{ item.goal2 }}
      </template>

      <template v-slot:item.actions="{item}">
        <v-icon class="mr-2" title="Редактировать" small @click="editItem(item)">fas fa-pen</v-icon>
        <v-icon title="Удалить" small @click="promptDelete(item)">fas fa-trash-alt</v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import MuDialogDeleteRecord from '~/components/DialogDeleteRecord'
import MuTitlePageAdmin from '~/components/TitlePageAdmin'

export default {
  name: 'games',
  layout: 'admin',
  components: {
    MuDialogDeleteRecord,
    MuTitlePageAdmin
  },
  async asyncData({store}) {
    await store.dispatch('game/loadGames')
    await store.dispatch('stadium/loadStadiums')
    await store.dispatch('group/loadGroups')
    await store.dispatch('team/loadTeams')
  },
  data() {
    return {
      dialog: false,
      dialogDelete: false,
      valid: true,
      loading: false,
      dateOpen: false,
      timeOpen: false,
      stadiums: [],
      groups: [],
      teams: [],
      headers: [
        {text: '№', value: 'game_no', align: 'center', width: '7%'},
        {text: 'Начало', value: 'start', align: 'center'},
        {text: 'Стадион', value: 'stadium'},
        {text: 'Группа', value: 'group'},
        {text: 'Команда', value: 'team1', align: 'center'},
        {text: 'Счёт', value: 'result', align: 'center', sortable: false},
        {text: 'Команда', value: 'team2', align: 'center'},
        {text: '', align: 'center', value: 'actions', sortable: false}
      ],
      startDate: new Date(2000, 0, 1),
      endDate: new Date(2000, 11, 31),
      // Случайная дата нужна для того, чтобы при редактировании и добавлении игры ВСЕГДА срабатывал watch dateCurrent
      dateCurrent: this.randomDate(new Date(2000, 0, 1), new Date(2000, 11, 31)).toISOString().substr(0, 10),
      editedIndex: -1,
      editedItem: {
        game_no: '',
        date: this.formatDate(new Date().toISOString().substr(0, 10)),
        time: new Date().toLocaleTimeString().substr(0, 5),
        stadium: '',
        group: '',
        team1: '',
        result: '',
        team2: '',
      },
      defaultItem: {
        game_no: '',
        date: this.formatDate(new Date().toISOString().substr(0, 10)),
        time: new Date().toLocaleTimeString().substr(0, 5),
        stadium: '',
        group: '',
        team1: '',
        result: '',
        team2: '',
      },
      rules: {
        required: value => !!value || 'Поле должно быть заполнено',
        rangeNo: value => value > 0 && value < 53 || 'Номер игры лежит в диапазоне от 1 до 52',
        isNumber: value => value == null || !isNaN(value) || 'Значение должно быть числом'
      },
    }
  },
  created() {
    let items = this.getStadiums

    for (let i = 0; i < items.length; i++) {
      this.stadiums.push({
        text: `${items[i].city} (${items[i].stadium})`,
        value: items[i].id
      })
    }

    items = this.getGroups

    for (let i = 0; i < items.length; i++) {
      this.groups.push({
        text: items[i].group,
        value: items[i].id
      })
    }

    items = this.getTeams

    for (let i = 0; i < items.length; i++) {
      this.teams.push({
        text: items[i].team,
        value: items[i].id
      })
    }
  },
  computed: {
    ...mapGetters({
      getGames: 'game/getGames',
      getStadiums: 'stadium/getStadiums',
      getGroups: 'group/getGroups',
      getTeams: 'team/getTeams',
    }),
    games() {
      return this.getGames
    },
    formTitle() {
      return this.editedIndex === -1 ? 'Добавить игру' : 'Редактировать игру'
    },
  },
  watch: {
    dateCurrent(val) {
      this.editedItem.date = this.formatDate(this.dateCurrent)
    },
  },
  methods: {
    ...mapActions({
      loadGames: 'game/loadGames',
      addGame: 'game/addGame',
      updateGame: 'game/updateGame',
      deleteGame: 'game/deleteGame'
    }),
    formatDate(date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${day}.${month}.${year}`
    },
    addItem() {
      this.editedIndex = -1
      this.editedItem = Object.assign({}, this.defaultItem);

      this.dialog = true
    },
    editItem(item) {
      this.dialog = true

      this.$nextTick(() => {
        this.$refs.form.reset()

        this.editedIndex = this.games.indexOf(item)
        this.editedItem = Object.assign({}, item)

        /*const date = new Date(item.start)
        this.dateCurrent = date.toISOString().substr(0, 10)*/

        if (this.editedIndex > -1) {
          const date = new Date(item.start)
          this.dateCurrent = date.toISOString().substr(0, 10)
          this.editedItem.time = date.toLocaleTimeString().substr(0, 5)
        }
      })
    },
    promptDelete(item) {
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    async deleteItem(data) {
      this.dialogDelete = false

      if (data.delete) {
        this.loading = true

        await this.deleteGame(this.editedItem)

        this.loading = false;
      }
    },
    close() {
      this.$refs.form.reset()
      this.dialog = false

      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1

        // Случайная дата нужна для того, чтобы при редактировании и добавлении игры ВСЕГДА срабатывал watch dateCurrent
        const date = this.randomDate(this.startDate, this.endDate)
        this.dateCurrent = date.toISOString().substr(0, 10)
      })
    },
    async save() {
      if (!this.$refs.form.validate()) return;

      this.loading = true

      const [day, month, year] = this.editedItem.date.split('.')
      const [hour, minute] = this.editedItem.time.split(':')
      this.editedItem.start = `${year}-${month}-${day} ${hour}:${minute}:00`

      if (typeof this.editedItem.goal1 == 'undefined') this.editedItem.goal1 = ''
      if (typeof this.editedItem.goal2 == 'undefined') this.editedItem.goal2 = ''

      if (this.editedIndex === -1) {
        await this.addGame(this.editedItem);
      } else {
        await this.updateGame(this.editedItem);
      }

      this.loading = false;

      this.close()
    },

    randomDate(start, end) {
      return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
