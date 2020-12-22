<template>
  <div>
    <mu-dialog-delete-record
      v-model="dialogDelete"
      :record="{
        title: 'стадиона',
        message: editedItem.stadium
      }"
      @deleteItem="deleteItem"
    />

    <mu-title-page-admin title="Стадионы" whatAdd="Добавить стадион" @add="addItem"/>

    <v-dialog v-model="dialog" max-width="275px">
      <v-card>
        <v-card-title class="dark blue-grey darken-3 pa-3 text-body-1">
          {{ formTitle }}
        </v-card-title>

        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-card-text
            class="grey darken-3 pt-2 pb-0"
            :style="{borderTop: '1px #eee solid !important', borderBottom: '1px #eee solid !important'}"
          >
            <v-text-field
              v-model="editedItem.city"
              autofocus
              label="Город"
              color="yellow"
              :rules="[rules.required]"
            />

            <v-text-field
              v-model="editedItem.stadium"
              label="Стадион"
              color="yellow"
              :rules="[rules.required]"
            />

            <v-img v-if="editedItem.image" :src="`/stadiums/${editedItem.image}`"/>

            <v-file-input
              accept="image/png, image/jpeg"
              :label="!editedItem.image ? 'Загрузить картинку' : 'Заменить картинку'"
              show-size
              v-model="file"
              :rules="[rules.image, rules.size]"
            />
          </v-card-text>
        </v-form>

        <v-card-actions class="dark blue-grey darken-3 py-2 px-5">
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="close">Отмена</v-btn>
          <v-btn
            color="success"
            text
            :loading="loading"
            @click="save"
          >
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-data-table
      dense
      class="mt-5 grey darken-3 mx-auto"
      :style="{maxWidth: '450px'}"
      :headers="headers"
      :items="stadiums"
      :items-per-page="stadiums.length"
      no-data-text="Стадионы ещё не введены"
      hide-default-footer
    >
      <template v-slot:item.image="{item}">
        <v-img :src="`/stadiums/${item.image}`" height="20" width="57"/>
      </template>

      <template v-slot:item.actions="{item}">
        <v-icon class="mr-2" title="Редактировать" small @click="editItem(item)">fas fa-pen</v-icon>
        <v-icon title="Удалить" small @click="promptDelete(item)">fas fa-trash-alt</v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import MuDialogDeleteRecord from '~/components/DialogDeleteRecord'
import MuTitlePageAdmin from '~/components/TitlePageAdmin'

export default {
  name: 'stadiums',
  layout: 'admin',
  components: {
    MuDialogDeleteRecord,
    MuTitlePageAdmin
  },
  async asyncData({store}) {
    await store.dispatch('stadium/loadStadiums')
  },
  data() {
    return {
      dialog: false,
      dialogDelete: false,
      valid: true,
      loading: false,
      file: null,
      headers: [
        {text: '', value: 'image', align: 'center', sortable: false, width: '5%'},
        {text: 'Город', value: 'city'},
        {text: 'Стадион', value: 'stadium'},
        {text: '', align: 'center', value: 'actions', sortable: false}
      ],
      editedIndex: -1,
      editedItem: {
        city: '',
        stadium: '',
        image: ''
      },
      defaultItem: {
        city: '',
        stadium: '',
        image: ''
      },
      rules: {
        required: value => !!value || 'Поле должно быть заполнено',
        size: value => !value || value.size < 100000 || 'Размер файла не должен быть больше 100Кб',
        image: value => !!value || !!this.editedItem.image || 'Поле должно быть заполнено'
      },
    }
  },
  computed: {
    ...mapGetters({
      getStadiums: 'stadium/getStadiums',
    }),
    stadiums() {
      return this.getStadiums
    },
    formTitle() {
      return this.editedIndex === -1 ? 'Добавить стадион' : 'Редактировать стадион'
    },
  },
  methods: {
    ...mapActions({
      loadStadiums: 'stadium/loadStadiums',
      addStadium: 'stadium/addStadium',
      updateStadium: 'stadium/updateStadium',
      deleteStadium: 'stadium/deleteStadium'
    }),
    addItem() {
      this.editedIndex = -1
      this.editedItem = Object.assign({}, this.defaultItem);

      this.dialog = true

      this.$nextTick(() => {
        this.$refs.form.reset()
      })
    },
    editItem(item) {
      this.editedIndex = this.stadiums.indexOf(item)
      this.editedItem = Object.assign({}, item)

      this.dialog = true
    },
    promptDelete(item) {
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    async deleteItem(data) {
      this.dialogDelete = false

      if (data.delete) {
        this.loading = true

        await this.deleteStadium(this.editedItem)

        this.loading = false;
      }
    },
    close() {
      this.$refs.form.reset()
      this.dialog = false

      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
        this.file = null
      })
    },
    async save() {
      if (!this.$refs.form.validate()) return;

      this.loading = true

      if (this.editedIndex === -1) {
        await this.addStadium({
          stadium: this.editedItem,
          file: this.file
        });
      } else {
        await this.updateStadium({
          stadium: this.editedItem,
          file: this.file
        });
      }

      this.loading = false;

      this.close()
    },
  }
}
</script>

<style lang="scss" scoped>
</style>
