<template>
  <div class="d-flex flex-column" :style="{width: '100%', height: '100%'}">
    <mu-dialog-delete-message v-model="dialog" :message="messageToDialog" @deleteMessage="deleteMessage"/>

    <v-dialog
      v-model="isMessage"
      persistent
      max-width="400"
    >
      <v-card>
        <v-card-title class="blue-grey lighten-3 subtitle-1 py-1">
          Сообщение
        </v-card-title>

        <v-card-text
          class="pb-0 blue-grey lighten-4"
          :style="{
              borderTop: '1px #eee solid !important',
              borderBottom: '1px #eee solid !important',
            }"
        >
          <v-row
            v-if="answer.nick"
            justify="end"
            dense
            class="caption font-italic"
            :style="{borderBottom: '1px #777 solid !important'}"
          >
            <v-col cols="auto">
              <v-icon>far fa-comment-dots</v-icon>
            </v-col>

            <v-col cols="auto">
              <div>{{ answer.nick }} {{ answer.date }}</div>
              <div class="mt-n1">{{ answer.text }}</div>
            </v-col>
          </v-row>

          <v-textarea
            class="message mb-3 pt-0"
            v-model="text"
            hide-details
            :rows="rows"
            autofocus
            @keyup.ctrl.enter="sendMessage"
          />
        </v-card-text>

        <v-card-actions class="dark blue-grey darken-3 py-1 px-5">
          <v-spacer></v-spacer>

          <v-btn color="error" text @click="cancel">
            Отмена
          </v-btn>

          <v-btn color="success" text :loading="loading" @click="sendMessage">
            Отправить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div ref="top" class="d-flex flex-row mt-2 pb-1 pr-1" :style="{borderBottom: '2px solid teal'}">
      <v-col class="pa-1" cols="9" sm="10">
        <h3 class="ml-5">
          {{ gamblers.length >= 1 ? 'Возможно, сейчас в чате:' : 'Сейчас в чате только Вы' }}
        </h3>
        <v-chip
          v-for="gambler in gamblers"
          :key="gambler.id"
          v-if="gambler.id !== (!currentGambler ? gambler.id : currentGambler.id)"
          class="ml-1 mt-1"
          dark
          :color="gambler.sex === 'м' ? 'blue lighten-2' : 'pink lighten-2'"
        >
          {{ gambler.nickname }}
        </v-chip>
      </v-col>

      <v-col class="pa-1 text-center" cols="3" sm="2">
        <v-tooltip bottom>
          <template v-slot:activator="{on}">
            <v-btn dark color="teal" v-on="on" @click.stop="isMessage = true">
              <v-icon>far fa-comment-dots</v-icon>
            </v-btn>
          </template>
          <span>Написать сообщение</span>
        </v-tooltip>
      </v-col>
    </div>

    <div ref="params" :style="{borderBottom: '2px solid teal !important'}">
      <v-card flat color="teal lighten-5">
        <v-card-actions class="pt-0">
          <v-radio-group dense class="mt-0" row hide-details v-model="range">
            <v-radio
              color="teal"
              v-for="item in rangeMessages"
              :key="item.value"
              :value="item.value"
              @change="range = item.value; changeParams()"
            >
              <template v-slot:label>
                <div class="teal--text text-body-2">
                  {{ item.label }}
                </div>
              </template>
            </v-radio>
          </v-radio-group>

          <v-spacer/>

          <v-checkbox
            dense
            class="mt-0"
            color="teal"
            hide-details
            v-model="systemMessages"
            @change="changeParams()"
          >
            <template v-slot:label>
              <div class="teal--text text-body-2">
                Показывать системные сообщения
              </div>
            </template>
          </v-checkbox>
        </v-card-actions>
      </v-card>
    </div>

    <div ref="chat" :style="{maxHeight: `calc(100vh - ${maxHeight})`, overflowY: 'auto'}">
      <v-card
        flat
        :width="widthMessages"
        color="teal lighten-4"
        class="my-1 mx-auto py-2"
      >
        <v-list
          v-for="message in messages"
          :key="message.id"
          :width="message.layout.list.width"
          color="teal lighten-4"
          class="px-2 py-0"
          :class="message.layout.list.class"
        >
          <v-list-item
            class="px-1"
            :style="{minHeight: '25px', borderBottom: '1px solid grey'}"
          >
            <v-list-item-avatar
              v-if="message.fromId === 0"
              width="25%"
              class="my-1 mr-1 justify-end"
            >
              <v-icon :style="{width: '50px'}">fas fa-user</v-icon>
            </v-list-item-avatar>

            <v-list-item-avatar v-else class="ma-2" :class="message.layout.avatar.class">
              <v-img width="20" :src="`/photo/${message.photo}`"></v-img>
            </v-list-item-avatar>

            <v-list-item-content
              class="py"
              :class="message.layout.content.class"
            >
              <v-list-item-subtitle
                class="text-caption text-md-body-2"
                :style="{whiteSpace: 'normal !important'}"
              >
                <span class="mr-2">{{ $moment(message.date).format('DD.MM.YYYY HH:mm:ss') }}</span>
                <b>{{ message.fromNick }}</b>
              </v-list-item-subtitle>

              <v-list-item-subtitle
                v-if="message.quoteNick"
                class="caption font-italic"
                :style="{whiteSpace: 'normal !important'}"
              >
                <v-icon class="mt-n1" x-small>far fa-comment-dots</v-icon>
                {{ message.quoteNick }} {{ message.quoteDate }} {{ message.quoteText }}
              </v-list-item-subtitle>

              <div v-if="message.fromId === getGambler.id" class="d-flex"
                   :class="message.layout.editButtons.class">
                <v-tooltip bottom>
                  <template v-slot:activator="{on}">
                    <v-btn
                      icon
                      x-small
                      color="pink"
                      v-on="on"
                      @click="openDialog(message)"
                    >
                      <v-icon size="15">fas fa-trash-alt</v-icon>
                    </v-btn>
                  </template>
                  <span>Удалить</span>
                </v-tooltip>

                <v-tooltip bottom>
                  <template v-slot:activator="{on}">
                    <v-btn
                      class="ml-1"
                      icon
                      x-small
                      color="indigo"
                      v-on="on"
                      @click="editMessage(message)"
                    >
                      <v-icon size="15">fas fa-pencil-alt</v-icon>
                    </v-btn>
                  </template>
                  <span>Редактировать</span>
                </v-tooltip>
              </div>

              <v-tooltip bottom>
                <template v-slot:activator="{on}">
                  <v-list-item-title
                    class="deep-teal--text text--darken-4 text-caption text-md-body-2"
                    v-html="message.message"
                    v-on="(message.fromId !== getGambler.id && message.fromId !== 0) ? on : ''"
                    @click.stop="(message.fromId !== getGambler.id && message.fromId !== 0) ? answerTo(message)
                    : null"
                    :style="(message.fromId !== getGambler.id && message.fromId !== 0) ? {cursor: 'pointer'} : ''"
                  />
                </template>
                <span>Цитировать</span>
              </v-tooltip>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </div>
  </div>
</template>

<script>
import MuDialogDeleteMessage from '~/components/DialogDeleteMessage'

import {mapGetters, mapMutations, mapActions} from 'vuex'

export default {
  name: 'chat',
  async asyncData({store, socket}) {
    await store.dispatch('chat/loadGamblers');
    const showSystemMessages = store.getters['chat/getShowSystem']
    await store.dispatch('chat/loadMessages', {range: 1, system: showSystemMessages})
  },
  data() {
    return {
      isMessage: false,
      loading: false,
      dialog: false,
      messageToDialog: null,
      message: null,
      text: '',
      rangeMessages: [
        {
          label: 'Сегодня/Вчера',
          value: 1
        },
        {
          label: 'За неделю',
          value: 7
        },
        {
          label: 'Все',
          value: 0
        },
      ],
      emptyMessage: false,
      range: 1,
      maxHeight: 0,
      answer: {
        nick: '',
        date: '',
        text: ''
      }
    }
  },
  components: {
    MuDialogDeleteMessage
  },
  mounted() {
    this.$socket.emit('addToChat', this.getGambler)

    this.maxHeight = this.$refs.top.clientHeight + this.$refs['params'].clientHeight + 125;
    this.maxHeight += 'px'

    setTimeout(() => {
      this.$refs['chat'].scrollTop = this.$refs['chat'].scrollHeight
    })
  },
  computed: {
    ...mapGetters({
      getGamblers: 'chat/getGamblers',
      getMessages: 'chat/getMessages',
      getGambler: 'gambler/getGambler',
      getShowSystem: 'chat/getShowSystem',
      //getMaxHeight: 'chat/getMaxHeight',
    }),
    systemMessages: {
      get: function () {
        return this.getShowSystem
      },
      set: function (show) {
        this.setShowSystem(show)
      }
    },
    currentGambler() {
      return this.getGambler
    },
    gamblers() {
      return this.getGamblers
    },
    messages() {
      return this.getMessages
    },
    rows() {
      let rows = 1;
      switch (this.$vuetify.breakpoint.name) {
        case 'xl':
        case 'lg':
        case 'md':
          rows = 3;
          break;
        case 'sm':
          rows = 4;
          break;
        default:
          rows = 5
      }

      return rows
    },
    widthMessages() {
      let width = '';
      switch (this.$vuetify.breakpoint.name) {
        case 'xl':
        case 'lg':
          width = '65%';
          break;
        case 'md':
          width = '85%';
          break;
        default:
          width = '100%'
      }

      return width
    },
  },
  watch: {
    messages() {
      this.maxHeight = this.$refs.top.clientHeight + this.$refs['params'].clientHeight + 125;
      this.maxHeight += 'px'

      setTimeout(() => {
        this.$refs['chat'].scrollTop = this.range === 1 ? this.$refs['chat'].scrollHeight : 0
      })
    },
  },
  methods: {
    ...mapMutations({
      setShowSystem: 'chat/SET_SHOW_SYSTEM',
      setMaxHeight: 'chat/SET_MAX_HEIGHT'
    }),
    ...mapActions({
      loadMessages: 'chat/loadMessages'
    }),
    openDialog(message) {
      this.emptyMessage = false;

      this.messageToDialog = message

      this.dialog = true;
    },
    async deleteMessage(data) {
      this.dialog = false;

      if (data.delete) {
        this.messageToDialog = null;

        const gambler = this.getGambler;
        const message = {...data.message};
        message.screenMessage =
          `${gambler.nickname} ${gambler.sex === 'м' ? 'удалил' : 'удалила'} сообщение от ${this.$moment(message.date).format('DD.MM.YYYY HH:mm:ss')}`;

        await this.$socket.emit('deleteMessage', message)
      }
    },
    editMessage(message) {
      this.emptyMessage = false;

      this.message = {...message};

      this.answer = {
        nick: message.quoteNick,
        date: message.quoteDate,
        text: message.quoteText
      }

      this.text = message.message.replace(/<br\/>/g, '\n')

      this.isMessage = true
    },
    cancel() {
      this.emptyMessage = false;
      this.message = null;
      this.text = ''
      this.isMessage = false
      this.answer = {
        nick: '',
        date: '',
        text: ''
      }
    },
    async changeParams() {
      await this.loadMessages({
        range: this.range,
        system: this.getShowSystem
      })
    },
    answerTo(message) {
      const lenMessage = 25
      this.answer = {
        nick: message.fromNick,
        date: this.$moment(message.date).format('DD.MM.YYYY HH:mm:ss'),
        text: message.message.replace('<br/>', ' ').slice(0, lenMessage) + (message.message.length > lenMessage ? '...' : '')
      }
      this.isMessage = true
    },
    async sendMessage() {
      if (!this.text.trim()) {
        this.emptyMessage = true;
        return
      }

      this.loading = true

      if (this.message) {
        this.message.message = this.text.replace(/([^>])\n/g, '$1<br/>')
        this.message.date = this.$moment(this.message.date).format('YYYY-MM-DD HH:mm:ss')

        const gambler = this.getGambler;
        this.message.screenMessage =
          `${gambler.nickname} ${gambler.sex === 'м' ? 'обновил' : 'обновила'} сообщение от ${this.$moment(this.message.date).format('DD.MM.YYYY HH:mm:ss')}`;

        await this.$socket.emit('editMessage', this.message);

        this.message = null
      } else {
        const gambler = this.getGambler;
        const message = {
          fromId: gambler.id,
          fromNick: gambler.nickname,
          photo: gambler.photo,
          to: 'uefa2020',
          message: this.text.replace(/([^>])\n/g, '$1<br/>'),
          quoteNick: this.answer.nick,
          quoteDate: this.answer.date,
          quoteText: this.answer.text,
          screenMessage: `${gambler.nickname} ${gambler.sex === 'м' ? 'прислал' : 'прислала'} сообщение`
        };

        await this.$socket.emit('newMessage', message);
      }

      this.text = '';
      this.emptyMessage = false;

      this.loading = false
      this.isMessage = false
      this.answer = {
        nick: '',
        date: '',
        text: ''
      }
      //event.target.blur()
    }
  }
}
</script>

<style lang="scss">
.message.v-textarea textarea {
  line-height: normal !important;
}

.message .v-icon.v-icon {
  color: #1976d2 !important
}

.v-icon.v-icon--dense {
  font-size: 18px;
}

/*.range .v-label,
.systemMessages .v-label {
  color: teal !important
}*/
</style>

<style lang="scss" scoped>
.v-list-item__title {
  white-space: normal !important
}
</style>
