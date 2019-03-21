<template>
  <b-modal class="add-board-game-modal" :active="active" @close="$emit('update:active', false)" :width="640">
    <div class="box">
      <h2 class="subtitle">{{$t("board-game.add-modal.title")}}</h2>

      <template v-if="filteredLibraryGames.length > 0">
        <h2 class="subtitle is-6">{{$t("board-game.add-modal.from-library")}}</h2>
        <div class="columns library-games is-mobile">
          <div class="column" v-for="boardGame in filteredLibraryGames" :key="boardGame.id">
            <board-game-preview class="is-small" :boardGame="boardGame">
              <p class="has-text-centered">
                <button class="button is-small is-primary"
                          :class="{'is-loading': !isExcluded(boardGame) && boardGame.loading}"
                          :disabled="isExcluded(boardGame)"
                          @click="add(boardGame)">
                    {{isExcluded(boardGame) ? $t('button.added') : $t('button.add')}}
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
                  {{boardGame.name}} <br>
                  <span class="has-text-grey">{{boardGame.year}}</span>
              </p>
              <div>
                <button class="button is-small is-primary"
                        :class="{'is-loading': !isExcluded(boardGame) && boardGame.loading}"
                        :disabled="isExcluded(boardGame)"
                        @click="add(boardGame)">
                  {{isExcluded(boardGame) ? $t('button.added') : $t('button.add')}}
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

import BoardGame from '@/utils/api/BoardGame';
import Library from '@/utils/api/Library';

export default {
  components: {BoardGamePreview},
  props: [
    'active',
    'excludedIds',
    'addFromLibrary'
  ],
  data() {
    return {
      data: [],
      libraryGames: [],
      filteredLibraryGames: [], // games not yet added to the board games list when opening the modal
      searchString: '',
      isFetching: false
    };
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
    }
  },
  methods: {
    filterLibraryGames() {
      this.filteredLibraryGames = this.libraryGames.filter(boardGame => !this.isExcluded(boardGame));
    },

    searchBoardGames: debounce(async function() {
      let str = this.searchString;
      if(str.length < 3) {
        this.data = [];
        return;
      }

      this.isFetching = true;
      try {
        this.data = await BoardGame.searchAll(str);
      }
      catch(error) {
        console.log(error);
      }
      this.isFetching = false;
    }, 500),

    isExcluded(boardGame) {
      let id = Number(boardGame.bgg_id || boardGame.id);
      return this.excludedIds.includes(id);
    },

    add(boardGame) {
      this.$set(boardGame, 'loading', true);
      this.$emit('add', boardGame.bgg_id || boardGame.id);
    }
  },
  async created() {
    if(this.addFromLibrary) {
      this.libraryGames = (await new Library().fetchGames()).map(item => item.board_game);
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
</style>