<template>
  <v-navigation-drawer
    :value="value"
    @input="$emit('input', $event)"
    app
    clipped
    mobile-breakpoint="600"
    width="175"
  >
    <v-list dense>
      <v-list-item
        v-for="(item, i) in menu"
        :key="i"
        link
        class="px-2 yellow--text"
        :to="item.to"
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
export default {
  name: 'DrawerLeftAdmin',
  props: {
    value: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      menu: [
        {
          title: 'Участники',
          to: '/admin/gamblers',
          icon: 'fas fa-users'
        },
        {
          title: 'Группы',
          to: '/admin/groups',
          icon: 'fas fa-calendar'
        },
        {
          title: 'Команды',
          to: '/admin/teams',
          icon: 'fas fa-calendar-alt'
        },
        {
          title: 'Стадионы',
          to: '/admin/stadiums',
          icon: 'fas fa-ring'
        },
        {
          title: 'Расписание',
          to: '/admin/schedule',
          icon: 'fas fa-clock'
        },
        {
          title: 'Письмо для регистрации',
          to: '/admin/email',
          icon: 'fas fa-envelope'
        },

      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.v-list-item__title {
  font-size: 1em !important;
  white-space: normal !important
}
</style>
