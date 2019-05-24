<template>
  <div class="board-game-list-wrapper">
    <div class="columns is-vcentered">
      <div class="column is-narrow">
        <b-field>
          <b-input :placeholder="$t('placeholder.search')" type="search" icon="search" v-model="searchString"></b-input>
        </b-field>
      </div>
      <div class="column is-narrow">
        <b-field>
          <b-select v-model="selectedSortOption">
            <option v-for="option in sortOptions" :value="option" :key="option.label">
              {{ option.label }}
            </option>
          </b-select>
        </b-field>
      </div>
      <div class="column is-narrow">
        <b-field class="narrow">
          <b-input v-model="nbPlayers" icon="users"></b-input>
        </b-field>
      </div>
      <div v-if="!allBelongToUser && canAdd" class="column is-narrow">
        <b-field class="narrow">
          <b-checkbox v-model="belongsToUserOnly">
            {{ $t('board-games-list.belongsToUser') }}
          </b-checkbox>
        </b-field>
      </div>
      <div v-if="canAdd" class="column has-text-right">
        <button class="button is-primary" @click="activeModal = true">
          {{$t('board-games-list.add')}}
        </button>
      </div>
    </div>

    <div class="has-text-centered has-text-grey" v-if="filteredBoardGames.length === 0">
      {{$t(boardGames.length === 0 ? 'board-games-list.no-games' : 'board-games-list.no-games-fitting-criteria')}}
    </div>

    <div v-else class="columns is-multiline">
      <div class="column is-2" v-for="boardGame in filteredBoardGames" :key="boardGame.id">
        <board-game-preview
          :boardGame="boardGame"
          :deleteButton="allBelongToUser || boardGame.belongsToUser"
          :mobileVertical="false"
          @delete="$emit('delete', boardGame.id)"
        />
      </div>
    </div>

    <add-board-game-modal
      :active.sync="activeModal"
      :providedByUser="providedByUser"
      :providedByOthers="providedByOthers"
      :addFromLibrary="addFromLibrary"
      :wishedBoardGames="wishedBoardGames"
      @add="$emit('add', $event)"
    />
  </div>
</template>

<script>
import BoardGamePreview from './BoardGamePreview';
import AddBoardGameModal from './AddBoardGameModal';

export default {
  props: {
    boardGames: Array,
    allBelongToUser: Boolean, // if true, delete button available for all board game, if false, only available for boardGames in which belongsToUser is true
    addFromLibrary: Boolean,
    canAdd: {
      type: Boolean,
      default: true
    },
    wishedBoardGames: Array
  },
  components: {
    BoardGamePreview,
    AddBoardGameModal
  },
  data() {
    return {
      searchString: '',
      sortOptions: [
        {label: this.$t('sort.name.a-z'), prop: 'name', asc: true},
        {label: this.$t('sort.name.z-a'), prop: 'name', asc: false},
        {label: this.$t('sort.year.increasing'), prop: 'year_published', asc: true},
        {label: this.$t('sort.year.decreasing'), prop: 'year_published', asc: false},
        {label: this.$t('sort.score.increasing'), prop: 'bgg_score', asc: true},
        {label: this.$t('sort.score.decreasing'), prop: 'bgg_score', asc: false},
      ],
      selectedSortOption: null,
      nbPlayers: null,
      activeModal: false,
      belongsToUserOnly: false,
    };
  },
  computed: {
    providedByUser() {
      let userBoardGames = this.allBelongToUser ? this.boardGames : this.boardGames.filter(bg => bg.belongsToUser);
      return new Set(userBoardGames.map(boardGame => boardGame.bgg_id));
    },
    providedByOthers() {
      let otherBoardGames = this.allBelongToUser ? [] : this.boardGames.filter(bg => !bg.belongsToUser || bg.count > 1);
      return new Set(otherBoardGames.map(boardGame => boardGame.bgg_id));
    },
    filteredBoardGames() {
      let str = this.searchString.toLowerCase();
      let nbPlayers = Number(this.nbPlayers);
      let {asc, prop: sortProp} = this.selectedSortOption;
      let gameBelongsToUserFilter = this.belongsToUserOnly;

      return this.boardGames.filter(boardGame => {
        return boardGame.name.toLowerCase().indexOf(str) >= 0
          && (!nbPlayers || (boardGame.min_players <= nbPlayers && boardGame.max_players >= nbPlayers))
          && (!gameBelongsToUserFilter || boardGame.belongsToUser);
      }).sort((a, b) => a[sortProp] < b[sortProp] ? (asc ? -1 : 1) : (asc ? 1 : -1));
    }
  },
  created() {
    this.selectedSortOption = this.sortOptions[0];
  }
};
</script>

<style lang="scss">
.board-game-list-wrapper .narrow.field {
  max-width: 7em;

  &:not(:last-child) {
    margin-right: 1em;
  }
}
</style>
