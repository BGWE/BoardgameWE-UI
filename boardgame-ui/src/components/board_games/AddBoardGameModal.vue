<template>
  <b-modal class="add-board-game-modal" :active="active" @close="$emit('update:active', false)" :width="640">
    <div class="box">
      <h2 class="subtitle">{{$t("board-game.add-modal.title")}}</h2>

      <!-- TODO: library -->

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
          <hr>
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
import BoardGame from '@/utils/api/BoardGame';

export default {
  props: [
    'active',
    'excludedIds'
  ],
  data() {
    return {
      data: [],
      searchString: '',
      isFetching: false
    };
  },
  watch: {
    active() {
      this.searchString = '';
      this.data = [];
    },
    searchString() {
      this.searchBoardGames();
    }
  },
  methods: {
    searchBoardGames: debounce(async function() {
      let str = this.searchString;
      if(str.length < 3) {
        this.data = [];
        return;
      }

      this.isFetching = true;
      try {
        this.data = await BoardGame.searchAll(str);
        console.log(this.data);
      }
      catch(error) {
        console.log(error);
      }
      this.isFetching = false;
    }, 500),

    isExcluded(boardGame) {
      return this.excludedIds.includes(Number(boardGame.id));
    },

    add(boardGame) {
      this.$set(boardGame, 'loading', true);
      this.$emit('add', boardGame.id);
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

hr {
  margin: 0.5em 0;
}
</style>


<style lang="scss">
.add-board-game-modal {
  .animation-content {
    overflow: visible;
  }
}
</style>

