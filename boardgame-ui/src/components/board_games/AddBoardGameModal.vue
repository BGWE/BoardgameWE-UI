<template>
  <b-modal class="add-board-game-modal" :active="active" @close="$emit('update:active', false)" :width="640">
    <div class="box">
      <h2 class="subtitle">{{$t("board-game.add-modal.title")}}</h2>

      <template v-if="filteredLibraryGames.length > 0">
        <h2 class="subtitle is-6">{{$t("board-game.add-modal.from-library")}}</h2>
        <div class="columns library-games is-mobile">
          <div class="column" v-for="boardGame in filteredLibraryGames" :key="boardGame.id">
            <board-game-preview
              class="is-small"
              :boardGame="boardGame"
              :wishCount="boardGame.countWished"
              :providedByOther="boardGame.providedByOther"
            >
              <p class="has-text-centered">
                <button
                  class="button is-small is-primary"
                  :class="{'is-loading': !boardGame.providedByUser && boardGame.loading}"
                  :disabled="boardGame.providedByUser"
                  @click="add(boardGame)"
                >
                    {{boardGame.providedByUser ? $t('button.added') : $t('button.add')}}
                </button>
              </p>
            </board-game-preview>
          </div>
        </div>
        <hr>
      </template>

      <b-field>
        <b-input :placeholder="$t('placeholder.search')" type="search" icon="search"
          v-model="searchString" :loading="isFetching">
        </b-input>
      </b-field>

      <div class="results">
        <div v-for="boardGame in data" :key="boardGame.id">
          <div class="is-flex">
              <p class="is-size-7">
                <span :class="{'provided': boardGame.providedByOther}">
                  {{boardGame.name}}
                </span>
                <span v-if="boardGame.providedByOther" :title="$t('boardgame.provided-by-other')" class="icon has-text-success">
                  <i class="fas fa-check-circle fa-lg"></i>
                </span>
                <wish-list-count :count="boardGame.countWished" />
                <br>
                <span class="has-text-grey">{{boardGame.year}}</span>
              </p>
              <div>
                <button
                  class="button is-small is-primary"
                  :class="{'is-loading': !boardGame.providedByUser && boardGame.loading}"
                  :disabled="boardGame.providedByUser"
                  @click="add(boardGame)"
                >
                  {{boardGame.providedByUser ? $t('button.added') : $t('button.add')}}
                </button>
              </div>
          </div>
          <hr class="small-margin">
        </div>

        <template slot="empty">
          <em v-if="isFetching">{{$t('global.fetching')}}</em>
          <template v-else>{{$t('global.no-result')}}</template>
        </template>
      </div>

      <p class="buttons">
        <button class="button" @click="$emit('update:active', false)">{{$t('button.cancel')}}</button>
      </p>
    </div>
  </b-modal>
</template>

<script>
import debounce from 'lodash.debounce';

import BoardGamePreview from './BoardGamePreview';
import WishListCount from '@/components/wish_list/WishListCount';

import BoardGame from '@/utils/api/BoardGame';
import Library from '@/utils/api/Library';

export default {
  props: {
    active: Boolean,
    providedByUser: Set, // list of BGG ids of board games provided by current user
    providedByOthers: { // list of BGG ids of board games provided by other users
      type: Set,
      default: () => []
    },
    addFromLibrary: Boolean,
    wishedBoardGames: Array
  },
  components: {
    BoardGamePreview,
    WishListCount
  },
  data() {
    return {
      data: [],
      libraryGames: [],
      filteredLibraryGames: [], // games not yet added to the board games list when opening the modal
      searchString: '',
      isFetching: false
    };
  },
  computed: {
    bggIdsLibraryGames() {
      return this.libraryGames.map(bg => bg.bgg_id);
    },
    wishCounts() {
      if(!this.wishedBoardGames) {
        return {};
      }
      return this.wishedBoardGames.reduce((mapping, wish) => {
        mapping[wish.board_game.bgg_id] = wish.count;
        return mapping;
      }, {});
    }
  },
  watch: {
    active() {
      this.libraryGames.forEach(boardGame => boardGame.loading = false); // reinitialize loading state
      this.filterLibraryGames();
      this.searchString = '';
      this.data = [];
    },
    searchString() {
      this.searchBoardGames();
    },
    providedByUser(ids) {
      this.libraryGames.forEach(bg => bg.providedByUser = ids.has(bg.bgg_id));
      this.data.forEach(bg => bg.providedByUser = ids.has(Number(bg.id)));
    }
  },
  methods: {
    filterLibraryGames() {
      this.filteredLibraryGames = this.libraryGames.filter(boardGame => !boardGame.providedByUser);
    },

    searchBoardGames: debounce(async function() {
      let str = this.searchString;
      if(str.length < 3) {
        this.data = [];
        return;
      }

      this.isFetching = true;
      try {
        let data = await BoardGame.searchAll(str);
        this.data = this.processBoardGames(data, false);
      }
      catch(error) {
        console.log(error);
      }
      this.isFetching = false;
    }, 500),

    add(boardGame) {
      this.$set(boardGame, 'loading', true);
      let bggId = Number(boardGame.bgg_id || boardGame.id);
      let inLibrary = this.bggIdsLibraryGames.includes(bggId);
      this.$emit('add', {bggId, inLibrary});
    },

    processBoardGames(boardGames, sort=true) {
      boardGames.forEach(boardGame => {
        let bggId = Number(boardGame.bgg_id || boardGame.id);
        boardGame.countWished = this.wishCounts[bggId] || 0;
        boardGame.providedByUser = this.providedByUser.has(bggId);
        boardGame.providedByOther = this.providedByOthers.has(bggId);
      });

      if(!sort) {
        return boardGames;
      }

      return boardGames.sort((a, b) => {
        if(a.providedByOther !== b.providedByOther) {
          if(a.providedByOther) {
            return 1; // if provided by other, move to end of list
          }
          else {
            return -1;
          }
        }
        return b.countWished - a.countWished; // most wished games to be displayed first
      });
    }
  },
  async created() {
    if(this.addFromLibrary) {
      let libraryGames = (await new Library().fetchGames()).map(item => item.board_game);
      this.libraryGames = this.processBoardGames(libraryGames);
      this.filterLibraryGames();
      console.log(this.libraryGames);
    }
  }
};
</script>

<style lang="scss" scoped>
.buttons {
  justify-content: flex-end !important;
}

.results {
  max-height: 15em;
  overflow: auto;
  margin: 1em 0px;
}

.is-flex {
  justify-content: space-between;

  .button {
    margin-right: 1em;
    margin-left: 2em;
  }
}

hr.small-margin {
  margin: 0.5em 0;
}

.library-games {
  max-width: 100%;
  overflow: auto;
}

.library-games .column {
  max-width: 8em;
  min-width: 8em;
}

.provided {
  color: rgba(0, 0, 0, 0.4);
  font-style: italic;
}
</style>
