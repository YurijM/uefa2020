<template>
  <v-dialog persistent v-model="open" max-width="700">
    <v-card>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6" class="mx-auto">
            <mu-team-result :team="item.team1"/>
          </v-col>
          <v-col v-if="groups.length > 1" cols="12" md="6">
            <mu-team-result :team="item.team2"/>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click="close">Закрыть</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {mapGetters} from 'vuex'
import MuTeamResult from './TeamResult'

export default {
  name: 'ResultsCompare',
  components: {
    MuTeamResult
  },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object
    }
  },
  computed: {
    ...mapGetters({
      groups: 'group/getGroups',
      teams: 'team/getTeams'
    }),
  },
  methods: {
    close() {
      this.$emit('closeViewResults');
    }
  }
}
</script>

<style scoped>

</style>
