<template>
  <div>
    <mu-title-page-admin title="Отправить письмо для регистрации" />

    <v-card class="mx-auto mt-3" color="grey darken-3" max-width="275">
      <v-card-actions class="flex-column">
        <v-text-field
          ref="email"
          label="e-mail"
          v-model="email"
          :rules="rules"
          color="yellow"
          autofocus
          :style="{width: '100%'}"
        >
          <!--<v-icon slot="prepend" small class="mt-1" color="yellow">fas fa-envelope</v-icon>-->
        </v-text-field>

        <v-btn
          class="mt-2"
          :loading="loading"
          :disabled="loading"
          @click="sendMail"
        >
          Отправить
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
  import MuTitlePageAdmin from '~/components/TitlePageAdmin'

  export default {
    name: 'email',
    layout: 'admin',
    components: {
      MuTitlePageAdmin
    },
    data() {
      return {
        email: '',
        rules: [
          value => !!value || 'Поле не может быть пустым.',
          value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Неверный формат e-mail.'
          },
        ],
        loading: false
      }
    },
    methods: {
      async sendMail() {
        if (!this.$refs['email'].validate()) return;

        this.loading = true;

        await this.$store.dispatch('email/sendMail', this.email);

        this.loading = false;
      }
    }
  }
</script>

<style scoped>

</style>
