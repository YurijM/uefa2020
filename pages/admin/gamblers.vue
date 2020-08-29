<template>
  <div>
    <mu-title-page-admin title="Игроки"/>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">
            {{`${editedItem.family} ${editedItem.name} (${editedItem.nickname})`}}
          </span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model="editedItem.nickname" label="Ник"/>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model="editedItem.family" label="Фамилия"/>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model="editedItem.name" label="Имя"/>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">Отмена</v-btn>
          <v-btn color="blue darken-1" text @click="save">Сохранить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
      <template v-slot:item.actions="{item}">
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
        dialog: false,
        headers: [
          {text: 'Ник', value: 'nickname'},
          {text: 'Фамилия', value: 'family'},
          {text: 'Имя', value: 'name'},
          {text: '', value: 'actions', sortable: false }
        ],
        editedIndex: -1,
        editedItem: {
          nickname: '',
          family: '',
          name: ''
        },
        defaultItem: {
          nickname: '',
          family: '',
          name: ''
        },
      }
    },
    watch: {
      dialog (val) {
        val || this.close()
      },
    },
    computed: {
      ...mapGetters({
        getGamblersOrderByNick: 'gambler/getGamblersOrderByNick'
      }),
      gamblers() {
        return this.getGamblersOrderByNick
      }
    },
    methods: {
      editItem (item) {
        this.editedIndex = this.gamblers.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.gamblers[this.editedIndex], this.editedItem)
        } else {
          this.gamblers.push(this.editedItem)
        }
        this.close()
      },
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
