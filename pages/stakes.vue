<template>
  <div class="mx-auto" :style="{width: '100%'}">
    <h2 class="text-center mt-1 purple--text">Ставки</h2>

    <v-alert
      dense
      type="info"
      class="mb-1 mx-auto"
      :style="{fontSize: '.9em', maxWidth: '98%'}"
    >
      На данной странице отображаются <span class="yellow--text"><strong>только</strong></span> игры, которые <span
      class="yellow--text"><strong>ещё не начались</strong></span>.<br>
      На игры, которые <span class="yellow--text"><strong>уже начались или закончились</strong></span>, ставки сделать <span
      class="yellow--text"><strong>нельзя</strong></span>.
    </v-alert>

    <v-dialog
      v-model="dialog"
      persistent
      max-width="350px"
    >
      <v-card>
        <v-card-title class="dark blue-grey darken-3 pa-3 text-body-1">
        </v-card-title>

        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-card-text
            class="pt-2 pb-0"
            :style="{borderTop: '1px #eee solid !important', borderBottom: '1px #eee solid !important'}"
          >
            <v-row>
              <v-col cols="6" class="py-0">
                {{ editedItem.group }}
              </v-col>
              <v-col cols="6" class="py-0 text-right">
                {{ dateGame }} {{ timeGame }}
              </v-col>
            </v-row>
            <v-card-title class="justify-center pa-0">
              {{editedItem.team1}} - {{editedItem.team2}}
            </v-card-title>

            <v-subheader
              class="justify-center font-weight-bold"
              :style="{height: 'auto'}"
            >
              Счёт
            </v-subheader>

            <v-row justify="center">
              <v-col cols="3" class="pt-0">
                <v-text-field
                  class="text-field-center"
                  v-model="editedItem.goal1"
                  :rules="[rules.required, rules.isNumber]"
                />
              </v-col>

              <v-col cols="3" class="pt-0">
                <v-text-field
                  class="text-field-center"
                  v-model="editedItem.goal2"
                  :rules="[rules.required, rules.isNumber]"
                />
              </v-col>
            </v-row>

            <div v-if="editedItem.order > countGroups && editedItem.goal1 && editedItem.goal1 === editedItem.goal2">
              <v-subheader
                class="justify-center font-weight-bold"
                :style="{height: 'auto'}"
              >
                Дополнительное время
              </v-subheader>

              <v-row justify="center">
                <v-col cols="4" class="py-0">
                  <v-text-field
                    class="text-field-center pt-1"
                    v-model="editedItem.addGoal1"
                    :rules="[rules.isNumber, rules.notLess1]"
                  />
                </v-col>

                <v-col cols="4" class="py-0">
                  <v-text-field
                    class="text-field-center pt-1"
                    v-model="editedItem.addGoal2"
                    :rules="[rules.isNumber, rules.notLess2]"
                  />
                </v-col>
              </v-row>

              <v-subheader
                class="justify-center font-weight-bold"
                :style="{height: 'auto'}"
              >
                Победитель по пенальти
              </v-subheader>

              <v-row
                v-if="editedItem.addGoal1 && editedItem.addGoal1 === editedItem.addGoal2 && editedItem.goal1 && editedItem.goal1 === editedItem.goal2"
                justify="center"
              >
                <v-col cols="7" class="pt-0">
                  <v-select
                    class="pb-0"
                    :items="gameTeams"
                    v-model="editedItem.penaltyId"
                    label="Команда"
                    no-data-text="Команды не заведены"
                    :rules="[rules.required]"
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

    <div v-if="stakePlayoff.length > 0">
      <h3 class="text-center mb-1">Плей-офф</h3>

      <v-data-table
        dense
        class="mb-2 mx-auto purple lighten-5"
        :style="{maxWidth: widthTable}"
        :headers="headerPlayoff"
        :items="stakePlayoff"
        item-key="game-no"
        group-by="group"
        no-data-text="Игры ещё не введены"
        hide-default-footer
        :items-per-page="stakePlayoff.length"
        mobile-breakpoint="350"
      >
        <template v-slot:group.header="{items, isOpen, toggle}">
          <th :colspan="Object.keys(items[0]).length">
            <v-icon small @click="toggle">
              {{ isOpen ? 'fas fa-minus' : 'fas fa-plus' }}
            </v-icon>
            <span class="ml-2" :style="{fontSize: '1.35em'}">{{ items[0].group }}</span>
          </th>
        </template>

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
          <v-icon class="mr-2" title="Редактировать" small @click="editItem(item)">fas fa-pen</v-icon>
        </template>
      </v-data-table>
    </div>

    <div v-if="stakeGroups.length > 0">
      <h3 class="text-center mb-1">Групповой турнир</h3>

      <v-data-table
        dense
        class="mb-5 mx-auto purple lighten-5"
        :style="{maxWidth: widthTable}"
        :headers="headerGroups"
        :items="stakeGroups"
        item-key="game-no"
        no-data-text="Игры ещё не введены"
        hide-default-footer
        :items-per-page="stakeGroups.length"
        mobile-breakpoint="350"
      >
        <template v-slot:group.header="{items, isOpen, toggle}">
          <th :colspan="Object.keys(items[0]).length">
            <v-icon small @click="toggle">
              {{ isOpen ? 'fas fa-minus' : 'fas fa-plus' }}
            </v-icon>
            <span class="ml-2" :style="{fontSize: '1.35em'}">{{ items[0].group }}</span>
          </th>
        </template>

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

        <template v-slot:item.actions="{item}">
          <v-icon class="mr-2" title="Редактировать" small @click="editItem(item)">fas fa-pen</v-icon>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'stakes',
  async asyncData({store}) {
    await store.dispatch('group/loadGroups')
    await store.dispatch('stake/loadStakes', {
      id: store.getters['gambler/getGambler'].id,
      order: store.getters['group/getCountGroups'],
      source: 'group'
    })
    await store.dispatch('stake/loadStakes', {
      id: store.getters['gambler/getGambler'].id,
      order: store.getters['group/getCountGroups'],
      source: 'playoff'
    })
  },
  data() {
    return {
      dialog: false,
      valid: true,
      loading: false,
      gameTeams: [],
      countGroups: 0,
      headerGroups: [
        {text: 'Начало', value: 'start'},
        {text: 'Город', value: 'city'},
        {text: 'Группа', value: 'group'},
        {text: '', value: 'team1', align: 'center', sortable: false},
        {text: 'Игра', value: 'result', align: 'center', sortable: false},
        {text: '', value: 'team2', align: 'center', sortable: false},
        {text: '', align: 'center', value: 'actions', sortable: false, width: '5%'}
      ],
      headerPlayoff: [
        {text: 'Начало', value: 'start', align: 'center'},
        {text: 'Город', value: 'city'},
        {text: '', value: 'team1', align: 'center', sortable: false},
        {text: 'Игра', value: 'result', align: 'center', sortable: false},
        {text: '', value: 'team2', align: 'center', sortable: false},
        {text: 'Доп.время', value: 'addTime', align: 'center', sortable: false},
        {text: 'По пенальти', value: 'penaltyTeam', align: 'center', sortable: false},
        {text: '', align: 'center', value: 'actions', sortable: false}
      ],
      editedIndex: -1,
      editedItem: {
        goal1: '',
        goal2: '',
        addGoal1: '',
        addGoal2: '',
        penaltyTeam: ''
      },
      defaultItem: {
        goal1: '',
        goal2: '',
        addGoal1: '',
        addGoal2: '',
        penaltyTeam: ''
      },
      dateGame: '',
      timeGame: '',
      rules: {
        required: value => !!value || 'Поле должно быть заполнено',
        isNumber: value => value == null || !isNaN(value) || 'Значение должно быть числом',
        notLess1: value => value >= this.editedItem.goal1 || `Значение не должно быть меньше ${this.editedItem.goal1}`,
        notLess2: value => value >= this.editedItem.goal2 || `Значение не должно быть меньше ${this.editedItem.goal2}`
      },
    }
  },
  created() {
    this.countGroups = this.getCountGroups
  },
  computed: {
    ...mapGetters({
      stakeGroups: 'stake/getStakeGroups',
      stakePlayoff: 'stake/getStakePlayoff',
      getCountGroups: 'group/getCountGroups',
    }),
    widthTable() {
      switch (this.$vuetify.breakpoint.name) {
        case 'lg':
          return '80%'
        case 'xl':
          return '60%'
        default:
          return '95%'
      }
    }
  },
  methods: {
    formatDate(date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${day}.${month}.${year}`
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

        this.editedIndex = (item.order > this.countGroups ? this.stakePlayoff.indexOf(item) : this.stakeGroups.indexOf(item))
        this.editedItem = Object.assign({}, item)

        const start = new Date(item.start)
        this.dateGame = this.formatDate(start.toISOString().substr(0, 10))
        this.timeGame = start.toLocaleTimeString().substr(0, 5)
      })
    },
    async save() {
    },
    close() {
      this.$refs.form.reset()
      this.dialog = false

      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
