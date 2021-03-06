<template>
  <div>
    <v-dialog persistent v-model="viewResult" max-width="500">
      <v-sheet class="pb-2 px-3 teal lighten-4">
        <mu-playoff-result :teams="teams"/>

        <div class="text-right">
          <v-btn
            class="py-0" color="red"
            small text outlined
            @click="viewResult = false"
          >
            Закрыть
          </v-btn>
        </div>
      </v-sheet>
    </v-dialog>

    <mu-stake-edit :open="dialog" :item="editedItem" @closeStakeEdit="closeStakeEdit()"/>

    <h3 class="text-center mb-1">Плей-офф</h3>

    <v-data-table
      dense
      class="mb-2 mx-auto teal lighten-5"
      :style="{ maxWidth: maxWidth }"
      :headers="headerPlayoff"
      :items="playoffStakes"
      item-key="game-no"
      group-by="order"
      no-data-text="Игры ещё не введены"
      hide-default-footer
      :items-per-page="playoffStakes.length"
      mobile-breakpoint="350"
    >
      <template v-slot:group.header="{ items, isOpen, toggle }">
        <th :colspan="Object.keys(items[0]).length">
          <v-icon small @click="toggle">
            {{ isOpen ? "fas fa-minus" : "fas fa-plus" }}
          </v-icon>
          <span class="ml-2" :style="{ fontSize: '1.25em' }">{{
              items[0].group
            }}</span>
        </th>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon
          class="mr-2"
          title="Просмотр результатов"
          x-small
          @click="getPlayoffResult(item)"
        >fas fa-eye
        </v-icon>

        <v-icon
          class="mr-2"
          title="Редактировать"
          x-small
          @click="editItem(item)"
        >fas fa-pen
        </v-icon>
      </template>

      <template v-slot:item.start="{ item }">
        {{ $moment(item.start).format('DD.MM.YYYY HH:mm') }}
      </template>

      <template v-slot:item.team1="{ item }">
        <div class="d-flex flex-row justify-center">
          <div class="flex-grow-1 mr-1 text-right">{{ item.team1 }}</div>
          <v-img
            class="flex-grow-0"
            :src="`/flags/${item.flag1}`"
            height="20"
            width="30"
          />
        </div>
      </template>

      <template v-slot:item.team2="{ item }">
        <div class="d-flex flex-row justify-center">
          <v-img
            class="flex-grow-0"
            :src="`/flags/${item.flag2}`"
            height="20"
            width="30"
          />
          <div class="flex-grow-1 ml-1 text-left">{{ item.team2 }}</div>
        </div>
      </template>

      <template v-slot:item.result="{ item }">
        {{ item.goal1 }} - {{ item.goal2 }}
      </template>

      <template v-slot:item.addTime="{ item }">
        <div v-if="item.addGoal1">
          {{ item.addGoal1 }} - {{ item.addGoal2 }}
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

import MuStakeEdit from '../components/StakeEdit'
import MuPlayoffResult from '../components/PlayoffResult'

export default {
  name: 'PlayoffStakes',
  props: {
    maxWidth: {
      type: String,
      default: '100%'
    }
  },
  components: {
    MuStakeEdit,
    MuPlayoffResult
  },
  data() {
    return {
      dialog: false,
      viewResult: false,
      teams: {},
      headerPlayoff: [
        {text: '', align: 'center', value: 'actions', sortable: false},
        {text: 'Начало', value: 'start', align: 'center'},
        {text: 'Город', value: 'city'},
        {text: '', value: 'team1', align: 'center', sortable: false},
        {text: 'Игра', value: 'result', align: 'center', sortable: false},
        {text: '', value: 'team2', align: 'center', sortable: false},
        {
          text: 'Доп.время',
          value: 'addTime',
          align: 'center',
          sortable: false,
        },
        {
          text: 'По пенальти',
          value: 'penaltyTeam',
          align: 'center',
          sortable: false,
        },
      ],
      defaultItem: {
        goal1: '',
        goal2: '',
        addGoal1: '',
        addGoal2: '',
        penaltyTeam: '',
      },
      editedItem: {
        goal1: '',
        goal2: '',
        addGoal1: '',
        addGoal2: '',
        penaltyTeam: '',
      },
    }
  },
  computed: {
    ...mapGetters({
      playoffStakes: 'stake/getStakesPlayoff',
      groupGames: 'game/getGroupGames',
      getTeamGames: 'game/getTeamGames'
    }),
    changedBreakpointWidth() {
      return this.$vuetify.breakpoint.width
    }
  },
  watch: {
    changedBreakpointWidth(width) {
      if (width < 1075) {
        if (this.headerPlayoff.length > 7) {
          this.headerPlayoff.splice(2, 1)
        }
      } else {
        if (this.headerPlayoff.length < 8) {
          this.headerPlayoff.splice(2, 0,
            {text: 'Город', value: 'city'}
          )
        }
      }
    }
  },
  methods: {
    formatDate(date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${day}.${month}.${year}`
    },
    getPlayoffResult(item) {
      this.teams = [
        {
          team: item.team1,
          games: this.getTeamGames(item.team1_id).slice(0, -1) // без последней игры, где команды встречаются между собой
        },
        {
          team: item.team2,
          games: this.getTeamGames(item.team2_id).slice(0, -1) // без последней игры, где команды встречаются между собой
        },
      ]
      this.viewResult = true
    },
    editItem(item) {
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    closeStakeEdit() {
      this.editedItem = Object.assign({}, this.defaultItem)
      this.dialog = false
    }
  }
}
</script>

<style scoped>

</style>
