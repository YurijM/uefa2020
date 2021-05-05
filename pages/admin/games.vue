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
      max-width="350px"
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
            <v-row>
              <v-col cols="5" class="pt-0 pb-1">
                <v-text-field
                  v-model="editedItem.game_no"
                  autofocus
                  type="number"
                  label="Номер игры"
                  color="yellow"
                  :rules="[rules.rangeNo]"
                />
              </v-col>

              <v-col cols="4" class="pt-0 pb-1">
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
                      hide-details
                      persistent-hint
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    locale="ru"
                    v-model="dateCurrent"
                    no-title
                    @input="dateOpen = false"
                  />
                </v-menu>
              </v-col>

              <v-col cols="3" class="pt-0 pb-1">
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
                      hide-details
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

            <v-row justify="center">
              <v-col cols="6" class="py-0">
                <v-select
                  class="pb-2"
                  :items="groups"
                  v-model="editedItem.group_id"
                  label="Группа"
                  hide-details
                  no-data-text="Группы не заведены"
                  color="yellow"
                  @change="loadGroupTeams"
                  :rules="[rules.required]"
                />
              </v-col>
            </v-row>

            <v-select
              class="pb-2"
              :items="stadiums"
              v-model="editedItem.stadium_id"
              label="Стадион"
              hide-details
              no-data-text="Стадионы не заведены"
              color="yellow"
              :rules="[rules.required]"
            />

            <v-row>
              <v-col cols="6" class="py-0">
                <v-select
                  :items="groupTeams"
                  v-model="editedItem.team1_id"
                  label="Команда 1"
                  hide-details
                  no-data-text="Команды не заведены"
                  color="yellow"
                  @change="loadGameTeams"
                  :rules="[rules.required]"
                />
              </v-col>

              <v-col cols="6" class="py-0">
                <v-select
                  :items="groupTeams"
                  v-model="editedItem.team2_id"
                  label="Команда 2"
                  hide-details
                  no-data-text="Команды не заведены"
                  color="yellow"
                  @change="loadGameTeams"
                  :rules="[rules.required]"
                />
              </v-col>
            </v-row>

            <v-subheader
              class="mt-2 justify-center"
              :style="{height: 'auto'}"
            >
              Счёт
            </v-subheader>

            <v-row justify="center">
              <v-col cols="3" class="pt-0">
                <v-text-field
                  class="text-field-center"
                  :disabled="!editedItem.team1_id"
                  v-model="editedItem.goal1"
                  hide-details
                  color="yellow"
                  :rules="[rules.isNumber]"
                />
              </v-col>

              <v-col cols="3" class="pt-0">
                <v-text-field
                  class="text-field-center"
                  :disabled="!editedItem.team1_id"
                  v-model="editedItem.goal2"
                  hide-details
                  color="yellow"
                  :rules="[rules.isNumber]"
                />
              </v-col>
            </v-row>

            <div v-if="order > countGroups && editedItem.goal1 && editedItem.goal1 === editedItem.goal2">
              <v-card-subtitle
                class="pa-0 mb-1 text-center yellow--text text--lighten-3"
                :style="{height: 'auto'}"
              >
                Дополнительное время
              </v-card-subtitle>

              <v-subheader
                class="justify-center"
                :style="{height: 'auto'}"
              >
                Счёт
              </v-subheader>

              <v-row justify="center">
                <v-col cols="4" class="py-0">
                  <v-text-field
                    class="text-field-center pt-1"
                    v-model="editedItem.addGoal1"
                    color="yellow"
                    :rules="[rules.isNumber]"
                  />
                </v-col>

                <v-col cols="4" class="py-0">
                  <v-text-field
                    class="text-field-center pt-1"
                    v-model="editedItem.addGoal2"
                    color="yellow"
                    :rules="[rules.isNumber]"
                  />
                </v-col>
              </v-row>

              <v-row
                v-if="editedItem.addGoal1 && editedItem.addGoal1 === editedItem.addGoal2 && editedItem.goal1 && editedItem.goal1 === editedItem.goal2"
                justify="center"
              >
                <v-col cols="12" class="py-0">
                  <v-card-subtitle
                    class="pa-0 text-center yellow--text text--lighten-3"
                    :style="{height: 'auto'}"
                  >
                    Победитель по пенальти
                  </v-card-subtitle>
                </v-col>

                <v-col cols="7" class="pt-0">
                  <v-select
                    class="pb-0"
                    :items="gameTeams"
                    v-model="editedItem.penaltyId"
                    label="Команда"
                    no-data-text="Команды не заведены"
                    color="yellow"
                  />
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-form>

        <v-card-actions class="dark blue-grey darken-3 py-2 px-5">
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            text
            @click="close()"
          >
            Отмена
          </v-btn>
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
      class="game mt-5 grey darken-3 mx-auto"
      :style="{maxWidth: widthTable}"
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
      <!--<template v-slot:header="{ props: { headers } }">
        <thead :style="{backgroundColor: '#eee'}">
        <tr>
          <th :colspan="headers.length">
            This is a header
          </th>
        </tr>
        </thead>
      </template>-->

      <template v-slot:item.start="{item}">
        {{ formatDate(new Date(item.start).toISOString().substr(0, 10)) }}
        {{ new Date(item.start).toLocaleTimeString().substr(0, 5) }}
      </template>

      <template v-slot:item.team1="{item}">
        <div class="d-flex flex-row justify-center">
          <div class="flex-grow-1 mr-1 text-right">{{ item.team1 }}</div>
          <v-img class="flex-grow-0" :src="`/flags/${item.flag1}`" height="20" width="30"/>
        </div>
      </template>

      <template v-slot:item.team2="{item}">
        <div class="d-flex flex-row justify-center">
          <v-img class="flex-grow-0" :src="`/flags/${item.flag2}`" height="20" width="30"/>
          <div class="flex-grow-1 ml-1 text-left">{{ item.team2 }}</div>
        </div>
      </template>

      <template v-slot:item.result="{item}">
        {{ item.goal1 }} - {{ item.goal2 }}
      </template>

      <template v-slot:item.addTime="{item}">
        <div v-if="item.addGoal1">
          {{ item.addGoal1 }} - {{ item.addGoal2 }}
        </div>
      </template>

      <template v-slot:item.actions="{item}">
        <v-icon class="mr-2" title="Редактировать" x-small @click="editItem(item)">fas fa-pen</v-icon>
        <v-icon title="Удалить" x-small @click="promptDelete(item)">fas fa-trash-alt</v-icon>
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
      gameTeams: [],
      groupTeams: [],
      order: 0,
      countGroups: 0,
      headers: [
        {text: '№', value: 'game_no', align: 'center', width: '5%'},
        {text: 'Начало', value: 'start', align: 'center'},
        {text: 'Город', value: 'city'},
        {text: 'Группа', value: 'group'},
        {text: '', value: 'team1', align: 'center', sortable: false},
        {text: 'Игра', value: 'result', align: 'center', sortable: false},
        {text: '', value: 'team2', align: 'center', sortable: false},
        {text: 'Доп.время', value: 'addTime', align: 'center', sortable: false},
        {text: 'По пенальти', value: 'penaltyTeam', align: 'center', sortable: false},
        {text: '', align: 'center', value: 'actions', sortable: false}
      ],
      startDate: new Date(2000, 0, 1),
      endDate: new Date(2000, 11, 31),
      // Случайная дата нужна для того, чтобы при редактировании и добавлении игры ВСЕГДА срабатывал watch dateCurrent
      //dateCurrent: this.randomDate(new Date(2000, 0, 1), new Date(2000, 11, 31)).toISOString().substr(0, 10),
      dateCurrent: '',
      editedIndex: -1,
      editedItem: {
        game_no: '',
        date: this.formatDate(new Date().toISOString().substr(0, 10)),
        time: new Date().toLocaleTimeString().substr(0, 5),
        stadium: '',
        group: '',
        team1: '',
        team2: '',
        goal1: '',
        goal2: '',
        addGoal1: '',
        addGoal2: '',
        penaltyTeam: ''
      },
      defaultItem: {
        game_no: '',
        date: this.formatDate(new Date().toISOString().substr(0, 10)),
        time: new Date().toLocaleTimeString().substr(0, 5),
        stadium: '',
        group: '',
        team1: '',
        team2: '',
        goal1: '',
        goal2: '',
        addGoal1: '',
        addGoal2: '',
        penaltyTeam: ''
      },
      rules: {
        required: value => !!value || 'Поле должно быть заполнено',
        rangeNo: value => value > 0 && value < 53 || 'Значение должно быть от 1 до 52',
        isNumber: value => value == null || !isNaN(value) || 'Значение должно быть числом',
        notLess1: value => value >= this.editedItem.goal1 || `Значение не должно быть меньше ${this.editedItem.goal1}`,
        notLess2: value => value >= this.editedItem.goal2 || `Значение не должно быть меньше ${this.editedItem.goal2}`
      },
    }
  },
  created() {
    // Случайная дата нужна для того, чтобы при редактировании и добавлении игры ВСЕГДА срабатывал watch dateCurrent
    this.dateCurrent = this.randomDate(this.startDate, this.endDate).toISOString().substr(0, 10)

    this.countGroups = this.getCountGroups

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
  },
  computed: {
    ...mapGetters({
      getGames: 'game/getGames',
      getStadiums: 'stadium/getStadiums',
      getGroups: 'group/getGroups',
      getCountGroups: 'group/getCountGroups',
      getTeams: 'team/getTeams',
    }),
    widthTable() {
      /*switch (this.$vuetify.breakpoint.name) {
        case 'lg':
          return '75%'
        case 'xl':
          return '60%'
        default:
          return '95%'
      }*/
      let width = '98%'
      if (this.$vuetify.breakpoint.width >= 1500) {
        width = '70%'
      } else if (this.$vuetify.breakpoint.width >= 1400) {
        width = '75%'
      } else if (this.$vuetify.breakpoint.width >= 1300) {
        width = '80%'
      } else if (this.$vuetify.breakpoint.width >= 1250) {
        width = '85%'
      } else if (this.$vuetify.breakpoint.width >= 1200) {
        width = '90%'
      } else if (this.$vuetify.breakpoint.width >= 1150) {
        width = '95%'
      }

      return width
    },
    games() {
      return this.getGames
    },
    formTitle() {
      return this.editedIndex === -1 ? 'Добавить игру' : 'Редактировать игру'
    },
  },
  watch: {
    dateCurrent() {
      this.editedItem.date = this.formatDate(this.dateCurrent)
    },
  },
  methods: {
    ...mapActions({
      loadGames: 'game/loadGames',
      addGame: 'game/addGame',
      updateGame: 'game/updateGame',
      deleteGame: 'game/deleteGame',
      changeResult: 'game/changeResult'
    }),
    formatDate(date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${day}.${month}.${year}`
    },
    loadGroupTeams() {
      this.groupTeams = []

      this.order = this.getGroups.find((e) => e.id === this.editedItem.group_id).order

      if (this.order > this.getCountGroups) {
        this.getTeams.forEach(team => this.groupTeams.push({value: team.id, text: team.team}))
      } else {
        this.getTeams
        .filter(e => e.group_id === this.editedItem.group_id)
        .forEach(team => this.groupTeams.push({value: team.id, text: team.team}))
      }

      this.loadGameTeams()
    },
    loadGameTeams() {
      this.gameTeams = []

      if (this.groupTeams.length > 0) {
        let team1 = null
        if (this.editedItem.team1_id) {
          team1 = this.groupTeams.find(e => e.value === this.editedItem.team1_id)
          if (!!team1) this.gameTeams.push({value: team1.value, text: team1.text})
        }

        let team2 = null
        if (this.editedItem.team2_id) {
          team2 = this.groupTeams.find(e => e.value === this.editedItem.team2_id)
          if (!!team2) this.gameTeams.push({value: team2.value, text: team2.text})
        }
      }
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

        this.gameTeams = [
          {
            value: item.team1_id,
            text: item.team1
          },
          {
            value: item.team2_id,
            text: item.team2
          }
        ]

        this.editedIndex = this.games.indexOf(item)
        this.editedItem = Object.assign({}, item)

        // Запоминаем текущий счёт
        this.editedItem.curResult = {
          goal1: this.editedItem.goal1,
          goal2: this.editedItem.goal2,
          addGoal1: this.editedItem.addGoal1,
          addGoal2: this.editedItem.addGoal2,
          penaltyTeam: this.editedItem.penaltyTeam
        }

        /*this.editedItem.curGoal1 = this.editedItem.goal1
        this.editedItem.curGoal2 = this.editedItem.goal2
        this.editedItem.curAddGoal1 = this.editedItem.addGoal1
        this.editedItem.curAddGoal2 = this.editedItem.addGoal2
        this.editedItem.curPenaltyTeam = this.editedItem.penaltyTeam*/

        this.loadGroupTeams()

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
        if (this.editedItem.goal1 != this.editedItem.goal2) {
          this.editedItem.addGoal1 = ''
          this.editedItem.addGoal2 = ''
          this.editedItem.penaltyId = 0
          this.editedItem.penaltyTeam = ''
        } else if ((this.editedItem.addGoal1 == '') || (this.editedItem.addGoal1 != this.editedItem.addGoal2)) {
          this.editedItem.penaltyId = 0
          this.editedItem.penaltyTeam = ''
        } else if (this.editedItem.penaltyId) {
          this.editedItem.penaltyTeam = this.getTeams.find(t => t.id === this.editedItem.penaltyId).team
        }

        await this.updateGame(this.editedItem);

        if (this.editedItem.curResult.goal1 !== this.editedItem.goal1 ||
          this.editedItem.curResult.goal2 !== this.editedItem.goal2 ||
          this.editedItem.curResult.addGoal1 !== this.editedItem.addGoal1 ||
          this.editedItem.curResult.addGoal2 !== this.editedItem.addGoal2 ||
          this.editedItem.curResult.penaltyId !== this.editedItem.penaltyId
        ) {
          await this.changeResult(this.editedItem)

          this.$socket.emit('changeResult', {
            team1: this.editedItem.team1,
            team2: this.editedItem.team2,
            goal1: this.editedItem.goal1,
            goal2: this.editedItem.goal2,
            addGoal1: this.editedItem.addGoal1,
            addGoal2: this.editedItem.addGoal2,
            penaltyTeam: this.editedItem.penaltyTeam
          })
        }
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
