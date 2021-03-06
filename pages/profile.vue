<template>
  <v-col
    class="mx-auto"
    cols="9" :sm="sm" :md="md" :lg="lg"
  >
    <v-card class="elevation-12" color="teal lighten-5">
      <v-toolbar
        color="teal lighten-1"
        dark
        flat
      >
        <v-icon left large>{{iconToolbar}}</v-icon>
        <v-toolbar-title
          class="text-center"
          :style="{width: '100%', whiteSpace: 'normal !important'}"
        >
          Профиль участника
          <div class="body-2" v-if="user.stake === 0">
            (деньги ещё не внесены)
          </div>
          <div v-else class="body-2">
            (взнос {{ user.stake }} <v-icon x-small>fas fa-ruble-sign</v-icon>)
          </div>
        </v-toolbar-title>
      </v-toolbar>

      <v-card-text class="py-1">
        <v-form ref="form" lazy-validation>
          <v-row class="justify-space-between">
            <v-col cols="7" md="6" lg="7" class="py-0">
              <v-text-field
                name="nickname"
                type="text"
                color="teal lighten-2"
                v-model="gambler.nickname"
                :rules="[rules.required]"
              >
                <template v-slot:label>
                  <div :style="{color: 'secondary'}">Ник</div>
                </template>
              </v-text-field>

              <v-text-field
                label="Фамилия"
                name="family"
                color="teal lighten-2"
                type="text"
                v-model="gambler.family"
                :rules="[rules.required]"
              />

              <v-text-field
                label="Имя"
                name="name"
                type="text"
                color="teal lighten-2"
                v-model="gambler.name"
                :rules="[rules.required]"
              />

              <v-label>Пол</v-label>
              <v-radio-group class="mt-0" v-model="gambler.sex" row :rules="[rules.required]">
                <v-radio color="primary" value="м">
                  <template v-slot:label>
                    <div :style="{fontSize: '1.25em', opacity: 1, color: 'rgba(0, 0, 0, 1)'}">м</div>
                  </template>
                </v-radio>
                <v-radio color="pink" value="ж">
                  <template v-slot:label>
                    <div :style="{fontSize: '1.25em', opacity: 1, color: 'rgba(0, 0, 0, 1)'}">ж</div>
                  </template>
                </v-radio>
              </v-radio-group>
            </v-col>

            <v-col v-if="gambler.photo" cols="5" md="6" lg="5" class="py-0">
              <v-img :src="`/photo/${gambler.photo}`"/>
            </v-col>

            <v-col cols="12" class="py-0">
              <v-text-field
                label="Телефон (для экстренной связи)"
                name="phone"
                type="text"
                color="teal lighten-2"
                class="mt-0 pt-0"
                v-model="gambler.phone"
              />
            </v-col>
          </v-row>

          <div>
            <v-file-input
              :rules="[rules.image, this.isSign ? rules.required : true]"
              accept="image/png, image/jpeg"
              prepend-icon="fas fa-camera-retro"
              :label="this.isSign ? 'Фото участника' : 'Заменить фото'"
              show-size
              :style="{paddingTop: 0, marginTop: 0}"
              v-model="file"
            />
            <div
              class="mb-1 font-italic indigo--text text--darken-4 caption"
              :style="{lineHeight: '12px'}"
            >
              Пожалуйста, загружайте фото с соотношением сторон 3х4. Постарайтесь, чтобы Ваше лицо располагалось
              ближе к центру
            </div>
          </div>
        </v-form>
      </v-card-text>

      <v-card-actions class="justify-space-around pt-0 pb-3">
        <v-btn
          v-if="!this.isSign"
          color="grey lighten-1"
          @click="cancel"
        >
          Отмена
        </v-btn>

        <v-btn
          :loading="loading"
          :disabled="loading"
          class="white--text"
          color="teal lighten-1"
          @click="save"
        >
          Сохранить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-col>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'

  export default {
    name: 'profile',
    layout({store}) {
      return (store.getters['gambler/isAuth'] ? 'default' : 'auth')
    },
    async asyncData({store}) {
      const user = await store.getters['gambler/getGambler'];
      const isSign = await store.getters['gambler/isSign'];

      return {
        user,
        isSign
      }
    },
    data() {
      return {
        gambler: {
          id: null,
          nickname: '',
          family: '',
          name: '',
          sex: '',
          phone: '',
          photo: ''
        },
        file: null,
        rules: {
          required: value => !!value || 'Поле должно быть заполнено',
          image: value => !value || value.size < 20000000 || 'Размер файла не должен быть больше 20Мб',
        },
        loading: false
      }
    },
    mounted() {
      this.gambler.id = this.user.id;
      this.gambler.nickname = this.user.nickname;
      this.gambler.family = this.user.family;
      this.gambler.name = this.user.name;
      this.gambler.sex = this.user.sex;
      this.gambler.phone = this.user.phone;
      this.gambler.photo = this.user.photo;
    },
    computed: {
      ...mapGetters({
        isAuth: 'gambler/isAuth',
        getGambler: 'gambler/getGambler',
        games: 'game/getGames'
      }),
      sm() {
        return (this.isAuth ? '8' : '6')
      },
      md() {
        return (this.isAuth ? '7' : '4')
      },
      lg() {
        return (this.isAuth ? '5' : '3')
      },
      iconToolbar() {
        let icon = '';

        switch (this.gambler.sex) {
          case 'м':
            icon = 'fas fa-male';
            break;
          case 'ж':
            icon = 'fas fa-female';
            break;
          default:
            icon = 'fas fa-user'
        }

        return icon
      }
    },
    methods: {
      ...mapActions({
        profile: 'gambler/profile'
      }),
      async cancel() {
        //this.$router.push('/chat');
        await this.checkStart()
      },
      async save() {
        if (!this.$refs.form.validate()) return;

        this.loading = true;

        await this.profile({
          gambler: this.gambler,
          file: this.file,
          breakpoint: this.$vuetify.breakpoint.name
        });

        this.loading = false;

        //Если сохранение профиля прошло успешно
        if (this.isAuth) {
          this.$socket.emit('changeProfile', {
            gambler: this.getGambler,
            isSign: this.isSign // "состояние" игрока при ВХОДЕ в режим редактирования профиля: если isSign, то это первоначальная запись
                                // данных, иначе - это редактирование уже имеющихся данных
          });

          //await this.$router.push('/chat')
          await this.checkStart()

        }
      },
      async checkStart() {
        const start = this.games[0].start
        const now = new Date()
        if (this.$moment(now).isBefore(start)) {
          await this.$router.push('/main')
        } else {
          await this.$router.push('/chat')
        }
      }
    }
  }
</script>

<style scoped>
  .v-label {
    font-size: .875em;
  }
</style>
