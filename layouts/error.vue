<template>
  <mu-page-error :text="error.statusCode == 404 ? 'Страница не найдена' : `Код ошибки: ${error.statusCode}`"/>
  <!--<mu-page-error text="Страница не найдена"/>-->
</template>

<script>
import MuPageError from '~/components/PageError'

export default {
  name: 'error',
  layout: 'empty',
  components: {
    MuPageError
  },
  props: {
    error: {
      type: Object,
      default: null
    }
  }
}
</script>

<style scoped>

</style>
