<template>
  <mu-page-error :width="350" text="Вы не являетесь администратором"/>
</template>

<script>
import MuPageError from '~/components/PageError'

export default {
  name: 'notadmin',
  layout: 'empty',
  components: {
    MuPageError
  }
  /*mounted: function() {
    setTimeout(() => {this.$router.go(-1)}, 3000);
    //this.$router.go(-1)
  }*/
}
</script>

<style scoped>

</style>
