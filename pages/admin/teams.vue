<template>
  <div>
    <mu-dialog-delete-record
      v-model="dialogDelete"
      :record="{
        title: 'команды',
        message: editedItem.team
      }"
      @deleteItem="deleteItem"
    />

    <mu-title-page-admin title="Команды" whatAdd="Добавить команду" @add="addItem"/>

    <v-dialog v-model="dialog" max-width="400px">
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
            <v-row>
              <v-col cols="6" class="pt-0">
                <v-text-field
                  v-model="editedItem.team"
                  autofocus
                  label="Команда"
                  color="yellow"
                  :rules="[rules.required]"
                />
              </v-col>

              <v-col cols="6" class="pt-0">
                <v-select
                  :items="groups"
                  v-model="editedItem.group_id"
                  label="Группа"
                  color="yellow"
                  :rules="[rules.required]"
                ></v-select>
              </v-col>
            </v-row>

            <v-row>
              <v-col v-if="editedItem.flag" cols="2" class="py-0">
                <v-img :src="`/flags/${editedItem.flag}`"/>
              </v-col>

              <v-col :cols="editedItem.flag ? 10 : 12" class="py-0">
                <v-file-input
                  accept="image/png, image/jpeg"
                  :label="!editedItem.flag ? 'Загрузить флаг' : 'Заменить флаг'"
                  show-size
                  class="pt-0 mt-0"
                  v-model="file"
                  :rules="[rules.image, rules.flag]"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col :cols="12" class="py-0">
                <v-card-text class="pb-0 px-0">
                  <v-slider
                    class="mt-5 mx-0"
                    hide-details="false"
                    label="Порядок отображения"
                    v-model="editedItem.order"
                    min="1"
                    max="4"
                    step="1"
                    dense
                    thumb-label="always"
                    ticks="always"
                    tick-size="3"
                  />
                </v-card-text>
              </v-col>

              <v-col v-if="editedItem.id" cols="12" class="py-0">
                <v-row>
                  <v-col cols="6" class="d-flex py-0 pr-4 align-center justify-end grey--text text--lighten-2" :style="{fontSize: '1.125em'}">
                    Место в группе
                  </v-col>
                  <v-col cols="2" class="pa-0">
                    <v-select
                      class="pt-0 mt-0"
                      :items="places"
                      v-model="editedItem.place"
                      color="yellow"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
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
      class="mt-10 grey darken-3 mx-auto"
      :style="{maxWidth: '475px'}"
      :headers="headers"
      :items="teams"
      no-data-text="Команды ещё не введены"
      :footer-props="{
        itemsPerPageAllText: 'Все',
        itemsPerPageOptions: [12, -1],
        itemsPerPageText: 'Строк на странице',
        pageText: '{0}-{1} из {2}'
      }"
    >
      <template v-slot:item.flag="{item}">
        <v-img :src="`/flags/${item.flag}`" height="20" width="30"/>
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
  name: 'teams',
  layout: 'admin',
  components: {
    MuDialogDeleteRecord,
    MuTitlePageAdmin
  },
  async asyncData({store}) {
    await store.dispatch('team/loadTeams')
    await store.dispatch('group/loadGroups')
  },
  data() {
    return {
      dialog: false,
      dialogDelete: false,
      valid: true,
      loading: false,
      groups: [],
      places: ['', 1, 2, 3, 4],
      file: null,
      headers: [
        {text: 'Флаг', value: 'flag', align: 'center', sortable: false, width: '5%'},
        {text: 'Команда', value: 'team'},
        {text: 'Группа', value: 'group'},
        {text: 'Порядок', align: 'center', value: 'order', sortable: false},
        {text: 'Место', align: 'center', value: 'place', sortable: false},
        {text: '', align: 'center', value: 'actions', sortable: false}
      ],
      editedIndex: -1,
      editedItem: {
        flag: '',
        team: '',
        group: '',
        order: '',
        place: ''
      },
      defaultItem: {
        flag: '',
        team: '',
        group: '',
        order: '',
        place: ''
      },
      rules: {
        required: value => !!value || 'Поле должно быть заполнено',
        image: value => !value || value.size < 100000 || 'Размер файла не должен быть больше 100Кб',
        flag: value => !!value || !!this.editedItem.flag || 'Поле должно быть заполнено'
      },
    }
  },
  created() {
    const items = this.getGroups

    for (let i = 0; i < items.length; i++) {
      this.groups.push({
        text: items[i].group,
        value: items[i].id
      })
    }
  },
  computed: {
    ...mapGetters({
      getTeams: 'team/getTeams',
      getGroups: 'group/getGroups'
    }),
    teams() {
      return this.getTeams
    },
    formTitle() {
      return this.editedIndex === -1 ? 'Добавить команду' : 'Редактировать команду'
    },
  },
  methods: {
    ...mapActions({
      loadTeams: 'team/loadTeams',
      addTeam: 'team/addTeam',
      updateTeam: 'team/updateTeam',
      deleteTeam: 'team/deleteTeam'
    }),
    addItem() {
      this.editedIndex = -1
      this.editedItem = Object.assign({}, this.defaultItem);

      this.dialog = true
    },
    editItem(item) {
      this.editedIndex = this.teams.indexOf(item)
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

        await this.deleteTeam(this.editedItem)

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
        await this.addTeam({
          team: this.editedItem,
          file: this.file
        });
      } else {
        await this.updateTeam({
          team: this.editedItem,
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
