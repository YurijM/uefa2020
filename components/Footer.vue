<template>
  <v-footer
    app
    dark
    height="40"
    :color="color"
    :class="`${textColor}--text`"
    class="justify-space-between"
  >
    <v-img src="/logo.png" max-width="30" max-height="30"/>
    <span>ЧЕ 2020</span>
    <span>&copy; 2020{{year}}</span>
  </v-footer>
</template>

<script>
	export default {
		name: 'Footer',
    props: {
		  color: {
		    type: String,
        default: '#272727'
      },
      year: {
		    type: String,
        default: ''
      },
      textColor: {
        type: String,
        default: 'white'
      }
    }
	}
</script>

<style scoped>

</style>
