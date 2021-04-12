<template>
  <v-dialog :value="open" persistent max-width="350px">
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-card>
        <v-card-title class="blue-grey lighten-3 text-subtitle-2 py-2">
          <v-row>
            <v-col cols="6" class="py-0">
              {{ item.group }}
            </v-col>
            <v-col cols="6" class="py-0 text-right">
              {{ dateGame }} {{ timeGame }}
            </v-col>
            <v-col cols="12" class="py-0 text-center">
              {{ item.city }}
            </v-col>
            <v-col cols="12" class="py-0">
              <v-img class="mx-auto" :src="`/stadiums/${item.stadiumImage}`" height="20" width="57" />
            </v-col>
            <v-col cols="12" class="py-0 text-center">
              стадион {{ item.stadium }}
            </v-col>
          </v-row>
        </v-card-title>

        <v-card-text
          class="pt-2 pb-0 blue-grey lighten-4"
          :style="{
              borderTop: '1px #eee solid !important',
              borderBottom: '1px #eee solid !important',
            }"
        >
          <v-card-title class="justify-center pa-0 primary&#45;&#45;text">
            {{ item.team1 }} - {{ item.team2 }}
          </v-card-title>

          <v-subheader
            class="justify-center font-weight-bold"
            :style="{ height: 'auto' }"
          >
            Счёт
          </v-subheader>

          <v-row justify="center">
            <v-col cols="3" class="pt-0">
              <v-text-field
                autofocus
                class="text-field-center"
                v-model="item.goal1"
                :rules="[rules.required, rules.isNumber]"
              />
            </v-col>

            <v-col cols="3" class="pt-0">
              <v-text-field
                class="text-field-center"
                v-model="item.goal2"
                :rules="[rules.required, rules.isNumber]"
              />
            </v-col>
          </v-row>

          <div
            v-if="
                item.order > countGroups &&
                item.goal1 &&
                item.goal1 === item.goal2
              "
          >
            <v-subheader
              class="justify-center font-weight-bold"
              :style="{ height: 'auto' }"
            >
              Дополнительное время
            </v-subheader>

            <v-row justify="center">
              <v-col cols="4" class="py-0">
                <v-text-field
                  class="text-field-center pt-1"
                  v-model="item.addGoal1"
                  :rules="[rules.isNumber, rules.notLess1]"
                />
              </v-col>

              <v-col cols="4" class="py-0">
                <v-text-field
                  class="text-field-center pt-1"
                  v-model="item.addGoal2"
                  :rules="[rules.isNumber, rules.notLess2]"
                />
              </v-col>
            </v-row>

            <v-row
              v-if="
                  item.addGoal1 &&
                  item.addGoal1 === item.addGoal2 &&
                  item.goal1 &&
                  item.goal1 === item.goal2
                "
              justify="center"
            >
              <v-subheader
                class="justify-center font-weight-bold"
                :style="{ height: 'auto' }"
              >
                Победитель по пенальти
              </v-subheader>

              <v-col cols="7" class="pt-0">
                <v-select
                  class="pb-0"
                  :items="gameTeams"
                  v-model="item.penaltyId"
                  label="Команда"
                  no-data-text="Команды не заведены"
                  :rules="[rules.required]"
                />
              </v-col>
            </v-row>
          </div>
        </v-card-text>

        <v-card-actions class="dark blue-grey darken-3 py-2 px-5">
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="close"> Отмена</v-btn>
          <v-btn color="success" text :loading="loading" @click="save">
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex'

export default {
  name: 'StakeEdit',
  props: {
    open: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      valid: false,
      loading: false,
      rules: {
        required: (value) => !!value || "Не может быть пустым",
        isNumber: (value) =>
          value == null || !isNaN(value) || "Должно быть число",
        notLess1: (value) =>
          value >= this.item.goal1 ||
          `Не может быть меньше ${this.item.goal1}`,
        notLess2: (value) =>
          value >= this.item.goal2 ||
          `Не может быть меньше ${this.item.goal2}`,
      },
    }
  },
  computed: {
    ...mapGetters({
      countGroups: "group/getCountGroups",
      gambler: "gambler/getGambler",
    }),
    dateGame() {
      if (this.item.start) {
        return this.formatDate((new Date(this.item.start)).toISOString().substr(0, 10))
      }
    },
    timeGame() {
      if (this.item.start) {
        return (new Date(this.item.start)).toLocaleTimeString().substr(0, 5)
      }
    }
  },
  methods: {
    ...mapMutations({
      clearMessage: 'common/CLEAR_MESSAGE',
      setMessage: 'common/SET_MESSAGE'
    }),
    ...mapActions({
      addStake: 'stake/addStake',
      updateStake: 'stake/updateStake',
    }),
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${day}.${month}.${year}`;
    },
    async save() {
      if (!this.$refs.form.validate()) return;

      const now = new Date();
      const start = new Date(this.item.start);

      if (now > start) {
        await this.clearMessage(null, {root: true})
        await this.setMessage(
          {
            status: "error",
            text: "К сожалению, Вы не можете изменить ставку, так как игра уже началась",
          },
          {root: true}
        )

        return
      }

      this.loading = true;

      this.item.gambler_id = this.gambler.id;

      if (!!this.item.stakeId) {
        await this.updateStake(this.item);
      } else {
        await this.addStake(this.item);
      }

      this.loading = false;

      this.close();
    },
    close() {
      this.$refs.form.reset()
      this.$emit('closeStakeEdit')
    }
  }
}
</script>

<style scoped>

</style>
