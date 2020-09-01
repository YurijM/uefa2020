<template>
  <v-card elevation="10" :max-width="width" class="mx-auto my-auto error">
    <v-card-title class="blue-grey lighten-3 white--text py-2 h6 justify-center">
      Тотализатор
    </v-card-title>

    <v-card-text
      class="d-flex align-center blue-grey lighten-5 red--text text-h5 pa-5"
      :style="{borderTop: '1px #777 solid !important', borderBottom: '1px #777 solid !important'}"
    >
      <v-img height="100" contain src="/admin.png"></v-img>
      <div class="ml-3 text-center">{{ text }}</div>
    </v-card-text>

    <v-card-actions class="dark blue-grey lighten-4 py-2 px-5">
      <v-btn fab dark x-small color="red darken-3" title="Вернуться на главную" @click="$router.push('/')">
        <v-icon>fas fa-home</v-icon>
      </v-btn>
      <v-spacer/>
      <v-btn fab dark x-small color="red darken-3" title="Вернуться назад" @click="$router.go(-1)">
        <v-icon>far fa-arrow-alt-circle-left</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'page-error',
  props: {
    width: {
      type: Number,
      default: 300
    },
    text: {
      type: String,
      default: 'Ошибка'
    }
  }
}
</script>

<style scoped>

</style>
