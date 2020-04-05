<template>
  <div>
    <b-loading :is-full-page="false" :active="loading"/>
    <template v-if="!loading">
      <div class="columns is-vcentered is-multiline">
        <div class="column is-narrow">
          <b-field class="narrow-field">
            <b-input v-model="nbPlayers" icon="users"></b-input>
          </b-field>
        </div>
        <div class="column is-narrow">
          <b-field grouped group-multiline>
            <b-field class="narrow-field">
              <b-select v-model="day">
                <option value="All">Day</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
                <option value="13">13</option>
                <option value="14">14</option>
                <option value="15">15</option>
                <option value="16">16</option>
                <option value="17">17</option>
                <option value="18">18</option>
                <option value="19">19</option>
                <option value="20">20</option>
                <option value="21">21</option>
                <option value="22">22</option>
                <option value="23">23</option>
                <option value="24">24</option>
                <option value="25">25</option>
                <option value="26">26</option>
                <option value="27">27</option>
                <option value="28">28</option>
                <option value="29">29</option>
                <option value="30">30</option>
                <option value="31">31</option>
              </b-select>
            </b-field>
            <b-field class="narrow-field">
              <b-select v-model="month">
                <option value="All">Month</option>
                <option value="0">January</option>
                <option value="1">February</option>
                <option value="2">March</option>
                <option value="3">April</option>
                <option value="4">May</option>
                <option value="5">June</option>
                <option value="6">July</option>
                <option value="7">August</option>
                <option value="8">September</option>
                <option value="9">Octobre</option>
                <option value="10">November</option>
                <option value="11">December</option>
              </b-select>
            </b-field>
            <b-field class="narrow-field">
              <b-select v-model="year">
                <option value="All">Year</option>
                <option value="2020">2020</option>
                <option value="2019">2019</option>
                <option value="2018">2018</option>
                <option value="2017">2017</option>
              </b-select>
            </b-field>
          </b-field>
        </div>
        <div v-if="isCurrentUserProfile" class="column has-text-right">
          <router-link tag="button" class="button is-primary" :to="{name: 'add-game'}">
            {{$t("games.add")}}
          </router-link>
        </div>
      </div>

      <p class="has-text-centered has-text-grey" v-if="games.length === 0">
        {{$t('event.games.no-games')}}
      </p>

      <games-list v-if="games"
        :games="filteredGames"
        :canEdit="isCurrentUserProfile"
        @gameDeleted="reload()"
      />

    </template>
  </div>
</template>

<script>
import User from '@/utils/api/User';
import GamesList from '@/components/games/GamesList';
import * as Helper from '@/utils/helper';

export default {
  props: {
    user: User,
    isCurrentUserProfile: Boolean
  },

  components: {
    GamesList
  },

  data() {
    return {
      games: null,
      nbPlayers: null,
      day: 'All',
      month: 'All',
      year: 'All',
      loading: true
    };
  },

  methods: {
    async reload() {
      this.loading = true;
      this.games = await this.user.fetchGames();
      this.loading = false;
    }
  },

  computed: {
    filteredGames() {
      let nbPlayers = Number(this.nbPlayers);
      let day = Number(this.day);
      let month = Number(this.month);
      let year = Number(this.year);

      return this.games.filter(game => {
        let date = Helper.ISO8601ToDate(game.createdAt);
        return ( !nbPlayers || game.players.length === nbPlayers ) &&
        ( isNaN(day) || date.getDate() === day ) &&
        ( isNaN(month) || date.getMonth() === month ) &&
        ( isNaN(year) || date.getFullYear() === year );
      });
    }
  },

  async created() {
    this.reload();
  },
};
</script>

<style lang="scss" scoped>
.narrow-field {
  max-width: 8.3em;
}

</style>
