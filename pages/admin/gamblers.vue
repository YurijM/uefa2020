<template>
  <div>
    <mu-title-page-admin title="Игроки"/>

    <v-data-table
      dense
      :headers="headers"
      :items="gamblers"
      sort-by="calories"
      class="mt-2 grey darken-3"
      :footer-props="{
      itemsPerPageAllText: 'Все',
      itemsPerPageOptions: [15, 25, -1],
      itemsPerPageText: 'Количество строк на странице',
      pageText: '{0}-{1} из {2}'
    }"
    >
      <template v-slot:item.actions="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script>
  import MuTitlePageAdmin from '~/components/TitlePageAdmin'
  import {mapGetters} from 'vuex'

  export default {
    name: 'gamblers',
    layout: 'admin',
    components: {
      MuTitlePageAdmin
    },
    data() {
      return {
        headers: [
          {text: 'Ник', value: 'nickname'},
          {text: 'Фамилия', value: 'family'},
          {text: 'Имя', value: 'name'}
        ],
      }
    },
    computed: {
      ...mapGetters({
        getGamblersOrderByNick: 'gambler/getGamblersOrderByNick'
      }),
      gamblers() {
        return this.getGamblersOrderByNick
      }
    }
  }
</script>

<style lang="scss">
  .v-application--is-ltr .v-data-footer__select .v-select {
    margin: 10px 0 10px 10px !important;
  }

  .v-application--is-ltr .v-data-footer__select {
    margin-right: 0px;
  }

  .v-application--is-ltr .v-data-footer__pagination {
    margin: 0 10px;
  }

  .v-application--is-ltr .v-data-footer__icons-before .v-btn:last-child {
    margin-right: 5px;
  }

  .v-btn--icon.v-size--default {
    height: 36px;
    width: 10px;
  }
</style>
