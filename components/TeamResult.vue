<template>
  <v-card>
    <v-card-subtitle>
      {{ team }}
    </v-card-subtitle>
  </v-card>
</template>

<script>
export default {
  name: 'TeamResult',
  props: {
    team: {
      type: String,
      default: ''
    },
  }
}
</script>

<style scoped>

</style>
