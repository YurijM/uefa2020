<template>
  <v-row class="yellow lighten-3 mt-n3 px-2 py-1" justify="space-between">
    <v-col cols="auto" class="red--text text--darken-1 text-h6">
      {{ title }}
    </v-col>
    <v-col v-if="whatAdd" align="right">
      <span
        class="blue--text"
        :style="{textDecoration: 'underline', cursor: 'pointer'}"
        @click="add"
      >
        {{ whatAdd }}
      </span>>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'TitlePageAdmin',
  props: {
    title: {
      type: String
    },
    whatAdd: {
      type: String,
      default: ''
    }
  },
  methods: {
    add() {
      this.$emit('add', true)
    }
  }
}
</script>

<style lang="scss" scoped>
.col {
  padding: 0 10px
}
</style>
