<template>
  <v-navigation-drawer
    :value="value"
    @input="$emit('input', $event)"
    app
    clipped
    right
    width="230"
    mobile-breakpoint="700"
    color="purple lighten-5"
  >
    <v-list dense>
      <v-list-item
        v-for="item in result"
        :key="item.gambler_id"
        class="px-2"
      >
        <v-list-item-avatar size="35" class="mr-2 my-0 mt-1">
          <v-img :src="`/photo/${item.photo}`"/>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title
            class="purple--text text--darken-4"
            :style="{whiteSpace: 'normal'}"
          >
            {{item.nickname}}
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
            {{item.points}}
          </v-chip>

          <div v-if="item.prevPlace > 0">
            <v-icon small :class="getColorStatistic(item.lastPlace, item.prevPlace)">
              {{getIcon(item.lastPlace, item.prevPlace)}}
            </v-icon>

            <span class="caption" :class="getColorStatistic(item.lastPlace, item.prevPlace)">
              {{getStatistic(item.lastPlace, item.prevPlace)}}
            </span>
          </div>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import {mapGetters} from 'vuex'

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
        getPlaces: 'point/getLastPlaces'
      }),
      result() {
        return this.getResult
      },
      isStarted() {
        return this.getPlaces.length > 0
      }
    },
    methods: {
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
      }
    }
  }
</script>

<style scoped>

</style>
