<template>
  <div>
    <mu-dialog-delete-record
      v-model="dialogDelete"
      :record="{
        title: 'группы',
        message: editedItem.group
      }"
      @deleteItem="deleteItem"
    />

    <mu-title-page-admin title="Группы" whatAdd="Добавить группу" @add="dialog = true"/>

    <v-dialog v-model="dialog" max-width="300px">
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
              v-model="editedItem.group"
              autofocus
              label="Группа"
              :rules="[rules.required]"
            />

            <v-subheader class="px-0" :style="{height: 'auto'}">Порядок отображения</v-subheader>
            <v-card-text class="pt-2 pb-0 px-0">
              <v-slider
                class="mt-7 mx-0"
                hide-details="false"
                v-model="editedItem.order"
                min="1"
                max="10"
                step="1"
                dense
                thumb-label="always"
                ticks="always"
                tick-size="3"
              />
            </v-card-text>
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
      :style="{maxWidth: '325px'}"
      :headers="headers"
      :items="groups"
      :hide-default-footer="true"
      no-data-text="Группы ещё не введены"
    >
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
  name: 'groups',
  layout: 'admin',
  components: {
    MuDialogDeleteRecord,
    MuTitlePageAdmin
  },
  async asyncData({store}) {
    await store.dispatch('group/loadGroups');
  },
  data() {
    return {
      dialog: false,
      dialogDelete: false,
      valid: true,
      loading: false,
      headers: [
        {text: 'Группа', value: 'group'},
        {text: 'Порядок', align: 'center', value: 'order'},
        {text: '', align: 'center', value: 'actions', sortable: false}
      ],
      editedIndex: -1,
      editedItem: {
        group: '',
        order: ''
      },
      defaultItem: {
        group: '',
        order: ''
      },
      rules: {
        required: value => !!value || 'Поле должно быть заполнено',
      },
    }
  },
  computed: {
    ...mapGetters({
      getGroups: 'group/getGroups'
    }),
    groups() {
      return this.getGroups
    },
    formTitle () {
      return this.editedIndex === -1 ? 'Добавить группу' : 'Редактировать группу'
    },
  },
  methods: {
    ...mapActions({
      loadGroups: 'group/loadGroups',
      addGroup: 'group/addGroup',
      updateGroup: 'group/updateGroup',
      deleteGroup: 'group/deleteGroup'
    }),
    editItem(item) {
      this.editedIndex = this.groups.indexOf(item)
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

        await this.deleteGroup(this.editedItem.id)
        await this.loadGroups()

        this.loading = false;
      }
    },
    close() {
      this.editedIndex = -1
      this.editedItem = Object.assign({}, this.defaultItem)

      this.dialog = false
    },
    async save() {
      if (!this.$refs.form.validate()) return;

      this.loading = true

      if (this.editedIndex === -1) {
        await this.addGroup(this.editedItem);
      } else {
        await this.updateGroup(this.editedItem);
      }

      await this.loadGroups()

      this.loading = false;

      this.close()
    },
  }
}
</script>

<style lang="scss" scoped>

</style>
