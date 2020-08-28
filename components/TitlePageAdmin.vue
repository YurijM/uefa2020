<template>
  <v-row class="yellow lighten-3 red--text text--darken-1 mt-n3 px-2 py-1 text-h6">
    {{title}}
  </v-row>
</template>

<script>
  export default {
    name: 'TitlePageAdmin',
    props: {
      title: {
        type: String
      }
    }
  }
</script>

<style scoped>

</style>
