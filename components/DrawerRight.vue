<template>
  <v-navigation-drawer
    :value="value"
    @input="$emit('input', $event)"
    app
    clipped
    right
    width="230"
    mobile-breakpoint="700"
    color="teal lighten-5"
  >
    <v-dialog v-model="dialog" max-width="750">
      <v-card
        class="mx-auto text-center"
        color="primary"
        dark
      >
        <v-card-text class="py-1">
          <div class="yellow--text accent-4 text-body-2 text-sm-h6">
            Динамика занимаемых мест
          </div>
        </v-card-text>

        <v-card-text class="pa-2">
          <v-sheet color="rgba(0, 0, 0, .12)">
            <v-sparkline
              :value="values"
              label-size="4"
              color="rgba(255, 255, 255, .7)"
              height="100"
              padding="10"
              stroke-linecap="round"
              smooth
              line-width="1"
            >
              <template v-slot:label="item">
                <tspan
                  :class="item.index === 0 ? 'yellow--text' : 'white'"
                  :dx="item.index === 0 ? 0 : 0"
                  dy="-1em"
                >
                  {{ places[item.index] }}
                </tspan>
                <tspan
                  :class="item.index === 0 ? 'yellow--text' : 'orange--text'"
                  :dx="item.index === 0
                  ? -14
                  : (Math.floor(places[item.index]) < 10
                  ? (Math.floor(points[item.index]) < 10 ? -4 : -5)
                  : (Math.floor(points[item.index]) < 10 ? -5 : -6))"
                  dy="1.25em"
                >
                  {{ item.index === 0 ? points[item.index] : Math.floor(points[item.index]) }}
                </tspan>
              </template>
            </v-sparkline>
          </v-sheet>
        </v-card-text>

        <v-card-text class="pb-2">
          <div class="yellow--text text-body-1 text-sm-h5">
            {{ gambler }}
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-list dense>
      <v-list-item
        v-for="item in result"
        :key="item.gambler_id"
        class="px-2"
      >
        <v-list-item-avatar rounded="lg" size="35" class="mr-2 my-0 mt-1">
          <v-img :src="`/photo/${item.photo}`"/>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title
            class="teal--text text--darken-4"
            :style="{whiteSpace: 'normal', cursor: (!isFirstGame ? 'pointer' : 'default')}"
            @click="!isFirstGame ? loadChart(item.gambler_id) : ''"
          >
            <v-tooltip
              v-if="!isFirstGame"
              content-class="text-caption"
              bottom
            >
              <template v-slot:activator="{ on, attrs }">
                <span style="text-decoration: underline" v-bind="attrs" v-on="on">{{ item.nickname }}</span>
              </template>
              <span>Посмотреть динамику результатов</span>
            </v-tooltip>

            <div v-else>
              {{ item.nickname }}
            </div>

          </v-list-item-title>
        </v-list-item-content>

        <v-list-item-action
          v-if="isStarted"
          class="ml-2 my-0 flex-row align-center justify-between"
          :style="{minWidth: '85px'}"
        >
          <v-chip
            :color="getColorWinner(item.lastPlace)"
            class="ml-0 mr-1 white--text"
            label
            small
          >
            {{ item.points }}
          </v-chip>

          <div v-if="item.prevPlace > 0">
            <v-icon small :class="getColorStatistic(parseInt(item.lastPlace), parseInt(item.prevPlace))">
              {{ getIcon(parseInt(item.lastPlace), parseInt(item.prevPlace)) }}
            </v-icon>

            <span class="caption" :class="getColorStatistic(parseInt(item.lastPlace), parseInt(item.prevPlace))">
              {{ getStatistic(parseInt(item.lastPlace), parseInt(item.prevPlace)) }}
            </span>
          </div>
        </v-list-item-action>
      </v-list-item>
    </v-list>

    <hr>

    <h5 class="text-center brown--text">Гендерный турнир</h5>

    <v-row dense>
      <v-col cols="6" class="sex">
        <v-icon color="indigo">fas fa-male</v-icon>
      </v-col>
      <v-col cols="6" class="sex">
        <v-icon color="pink">fas fa-female</v-icon>
      </v-col>

      <v-col cols="6" class="sex" :class="getColor('m')">{{ resultMen }}</v-col>
      <v-col cols="6" class="sex" :class="getColor('w')">{{ resultWomen }}</v-col>
    </v-row>

    <hr>
  </v-navigation-drawer>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'

export default {
  name: 'DrawerRight',
  props: {
    value: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dialog: false,
      values: [],
      places: [],
      points: [],
      gambler: '',
      placeColors: [
        {place: 1, color: 'error'},
        {place: 2, color: 'success'},
        {place: 3, color: 'primary'}
      ]
    }
  },
  computed: {
    ...mapGetters({
      getResult: 'point/getResult',
      getPlaces: 'point/getLastPlaces',
      getPoints: 'point/getPoints',
      getGamblers: 'gambler/getGamblers'
    }),
    result() {
      return this.getResult
    },
    resultMen() {
      const sex = this.getResult.filter(r => r.sex == 'м')

      if (sex.length === 0)
      {
        return '0.00'
      } else {
        let s = 0
        return (sex.map(e => s += parseFloat(e.points)).reverse()[0] / sex.length).toFixed(2)
      }
    },
    resultWomen() {
      const sex = this.getResult.filter(r => r.sex == 'ж')

      if (sex.length === 0)
      {
        return '0.00'
      } else {
        let s = 0
        return (sex.map(e => s += parseFloat(e.points)).reverse()[0] / sex.length).toFixed(2)
      }
    },
    isStarted() {
      return this.getPlaces.length > 0
    },
    isFirstGame() {
      return this.getPlaces.length === 0 || this.getPlaces[0].prevPlace == '0'
    }
  },
  methods: {
    ...mapActions({
      loadPoints: 'point/loadPoints'
    }),
    getIcon(place, prev) {
      let icon = 'fas fa-arrows-alt-h';

      if (place < prev) {
        icon = 'fas fa-arrow-up';
      } else if (place > prev) {
        icon = 'fas fa-arrow-down';
      }

      return icon;
    },
    getStatistic(place, prev) {
      let statistic = '';

      if (place < prev) {
        statistic = '+' + (prev - place);
      } else if (place > prev) {
        statistic = '-' + (place - prev);
      }

      return statistic;
    },
    getColorStatistic(place, prev) {
      let color = 'green--text text--darken-2';

      if (place < prev) {
        color = 'red--text';
      } else if (place > prev) {
        color = 'blue-grey--text text--darken-3';
      }

      return color;
    },
    getColorWinner(place) {
      const item = this.placeColors.find(c => c.place === parseInt(place))
      return (place > 3 || item == undefined ? 'blue-grey darken-1' : item.color)
    },
    getColor(sex) {
      return (sex === 'm'
          ? ((this.resultMen > this.resultWomen) ? 'red--text text--accent-4' : '')
          : ((this.resultWomen > this.resultMen) ? 'red--text text--accent-4' : '')
      )
    },
    async loadChart(id) {
      this.dialog = true

      this.values = [0]
      this.places = [count]
      this.points = [0]

      const item = this.getGamblers.find(e => e.id === id)
      this.gambler = `${item.family} ${item.name} (${item.nickname})`

      const count = this.getGamblers.length

      this.values = [0]
      this.places = ['место:']
      this.points = ['очки:']

      let points = 0

      await this.loadPoints()

      this.getPoints.filter(e => e.gambler_id == id).forEach(e => {
        this.values.push(count - e.place)
        this.places.push(e.place)
        points += parseFloat(e.points)
        this.points.push(parseFloat(points).toFixed(2))
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.sex {
  text-align: center;
  font-weight: bold;
}
</style>
