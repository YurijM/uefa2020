<template>
  <v-navigation-drawer
    :value="value"
    @input="$emit('input', $event)"
    app
    clipped
    width="150"
    mobile-breakpoint="800"
    color="teal lighten-5"
  >
    <v-list dense>
      <v-list-item
        v-for="(item, i) in menu"
        :key="i"
        link
        class="px-2 teal--text text--darken-3"
        :to="item.to"
        v-if="(item.hasOwnProperty('show') ? item.show : item.status <= (!!gambler ? gambler.status : 0))"
      >
        <v-list-item-action class="mr-1">
          <v-icon small>{{ item.icon }}</v-icon>
        </v-list-item-action>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'DrawerLeft',
  props: {
    value: {
      type: Boolean,
      default: true
    },
    showWinners: {
      type: Boolean,
      default: false
    }
  },
  async asyncData({store}) {
    const gamblerId = store.getters['gambler/getGambler'].id
  },
  data() {
    return {
      menu: [
        {
          title: 'Правила',
          to: '/rules',
          icon: 'fas fa-file-alt',
          status: 1
        },
        {
          title: 'Участники',
          to: '/gamblers',
          icon: 'fas fa-users',
          status: 1
        },
        {
          title: 'Игры',
          to: '/games',
          icon: 'fas fa-futbol',
          status: 10
        },
        {
          title: 'Ставки',
          to: '/stakes',
          icon: 'fas fa-money-check',
          status: 10
        },
        {
          title: 'Тотализатор',
          to: '/totalizator',
          icon: 'fas fa-money-bill-alt',
          status: 10
        },
        {
          title: 'Победители',
          to: '/winners',
          icon: 'fas fa-trophy',
          status: 10
          //show: this.showWinners
        },
        {
          title: 'Чат',
          to: '/chat',
          icon: 'fas fa-comments',
          status: 1
        }
      ]
    }
  },
  /*created() {
    this.menu.sort((a, b) => {
      // Используем toUpperCase() для преобразования регистра
      const title1 = a.title.toUpperCase();
      const title2 = b.title.toUpperCase();

      return (title1 > title2 ? 1 : -1)
    })
  },*/
  computed: {
    ...mapGetters({
      gambler: 'gambler/getGambler'
    })
  }
}
</script>

<style scoped>

</style>
