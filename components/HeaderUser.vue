<template>
  <v-menu nudge-bottom="30" nudge-right="45" open-on-hover>
    <template v-slot:activator="{ on }">
      <div
        class="ml-1 mr-5 mr-sm-8 mr-md-10 mr-lg-12"
        v-on="on"
        :style="{cursor: 'pointer'}"
      >
        <v-avatar size="45">
          <img
            :src="!!gambler ? `/photo/${gambler.photo}` : 'user.jpg'"
            :alt="!!gambler ? gambler.nickname : ''"
          >
        </v-avatar>

        <span :style="{textDecoration: 'underline'}">{{!!gambler ? gambler.nickname : ''}}</span>
      </div>
    </template>

    <v-list class="py-1" color="teal lighten-3">
      <v-list-item
        v-if="!!gambler ? gambler.admin : 0"
        class="px-3 mb-1"
        :style="{minHeight: '10px'}"
        @click="$router.push('/admin')"
      >
        <v-list-item-title class="yellow--text text--lighten-3 caption text-center">
          Админка
        </v-list-item-title>
      </v-list-item>

      <v-divider v-if="!!gambler ? gambler.admin : 0" class="mb-1"/>

      <v-list-item
        class="px-3 mb-1"
        :style="{minHeight: '10px'}"
        @click="$router.push('/profile')"
      >
        <v-list-item-title class="yellow--text text--lighten-3 caption text-center">
          Профиль
        </v-list-item-title>
      </v-list-item>

      <v-divider/>

      <v-list-item
        class="px-3"
        :style="{minHeight: '10px'}"
        @click="openDialog"
      >
        <v-list-item-title class="yellow--text text--lighten-3 caption text-center">
          Выход
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
  export default {
    name: 'HeaderUser',
    data() {
      return {
        code: 0
      }
    },
    computed: {
      gambler() {
        return this.$store.getters['gambler/getGambler'];
      }
    },
    methods: {
      openDialog() {
        this.$emit('openDialog', {dialog: true});
      }
    }
  }
</script>

<style scoped>

</style>
