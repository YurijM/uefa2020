<template>
  <div>
    <v-dialog persistent v-model="viewResult" max-width="500">
      <v-sheet class="px-3 py-1 teal lighten-4">
        <mu-group-result :group="group" :result="result"/>
        <div class="text-right mt-1">
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

    <h3 class="text-center mb-1">Групповой турнир</h3>

    <v-data-table
      dense
      class="mb-5 mx-auto teal lighten-5"
      :style="{ maxWidth: maxWidth }"
      :headers="header"
      group-by="startDate"
      :items="stakes"
      item-key="game-no"
      no-data-text="Игры ещё не введены"
      hide-default-footer
      :items-per-page="stakes.length"
      mobile-breakpoint="350"
    >
      <template v-slot:group.header="{ items, isOpen, toggle }">
        <th :colspan="Object.keys(items[0]).length">
          <v-icon small @click="toggle">
            {{ isOpen ? "fas fa-minus" : "fas fa-plus" }}
          </v-icon>
          <span class="ml-2" :style="{ fontSize: '1.25em' }">{{
              items[0].startDate
            }}</span>
        </th>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon
          class="mr-2"
          title="Просмотр результатов"
          x-small
          @click="getGroupResult(item.groupId, item.group)"
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
        {{ $moment(item.start).format('HH:mm') }}
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
    </v-data-table>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

import MuStakeEdit from '../components/StakeEdit'
import MuGroupResult from '../components/GroupResult'

export default {
  name: 'GroupStakes',
  props: {
    maxWidth: {
      type: String,
      default: '100%'
    }
  },
  components: {
    MuStakeEdit,
    MuGroupResult
  },
  data() {
    return {
      dialog: false,
      viewResult: false,
      group: '',
      result: [],
      header: [
        {
          text: '',
          align: 'center',
          value: 'actions',
          sortable: false,
        },
        {text: 'Начало', value: 'start'},
        {text: 'Город', value: 'city'},
        {text: 'Группа', value: 'group'},
        {text: '', value: 'team1', align: 'center', sortable: false},
        {text: 'Игра', value: 'result', align: 'center', sortable: false},
        {text: '', value: 'team2', align: 'center', sortable: false},
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
      stakes: 'stake/getStakesGroups',
      groupGames: 'game/getGroupGames'
    }),
    changedBreakpointWidth() {
      return this.$vuetify.breakpoint.width
    }
  },
  watch: {
    changedBreakpointWidth(width) {
      if (width < 1075) {
        if (this.header.length > 5) {
          this.header.splice(2, 2)
        }
      } else {
        if (this.header.length < 7) {
          this.header.splice(2, 0,
            {text: 'Город', value: 'city'},
            {text: 'Группа', value: 'group'}
          )
        }
      }
    }
  },
  methods: {
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split('-');
      return `${day}.${month}.${year}`
    },
    getGroupResult(groupId, group) {
      this.group = group
      this.result = this.groupGames(groupId)
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
