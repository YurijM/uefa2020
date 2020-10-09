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
    }
  },
  computed: {
    ...mapGetters({
      stakeGroups: 'stake/getStakeGroups',
      stakePlayoff: 'stake/getStakePlayoff',
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
  }
}
</script>

<style scoped>

</style>
