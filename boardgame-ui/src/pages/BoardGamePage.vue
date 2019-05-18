<template>
  <div class="wrapper">
    <b-loading :is-full-page="false" :active="loading" />
    <div class="section" v-if="error">
      <b-message type="is-danger">{{$t('error.unexpected')}}</b-message>
    </div>
    <template v-else-if="!loading">
      <hero-title-page-layout :title="`${boardGame.name} (${boardGame.year_published})`" />
      <div class="container">
        <div class="section">
          <div class="columns">
            <div class="column is-narrow">
              <div class="box image-details">
                <p class="has-text-centered">
                  <img :src="boardGame.image" class="boardgame-img">
                </p>

                <hr>

                <a class="button is-fullwidth" :href="bggUrl">
                  {{$t('boardgame.view-in-bgg')}}
                </a>
              </div>
            </div>
            <div class="column">

              <div class="box">
                <div class="level">
                  <div class="level-item has-text-centered">
                    <div>
                      <p class="heading">{{$t('boardgame.duration.label')}}</p>
                      <p class="subtitle"><bgc-duration :duration="boardGame.playing_time" /></p>
                    </div>
                  </div>
                  <div class="level-item has-text-centered">
                    <div>
                      <p class="heading">{{$t('boardgame.players')}}</p>
                      <p class="subtitle">{{playerCountDisplay}}</p>
                    </div>
                  </div>
                  <div class="level-item has-text-centered">
                    <div>
                      <p class="heading">{{$t('boardgame.score')}}</p>
                      <p class="subtitle">{{boardGame.bgg_score.toFixed(2)}} / 10</p>
                    </div>
                  </div>
                </div>
              </div>

              <h2 class="subtitle">{{$t('boardgame.description')}}</h2>
              <p v-html="boardGame.description"></p>

              <hr>

              <h2 class="subtitle">{{$t('boardgame.mechanics')}}</h2>
              <b-taglist>
                <b-tag class="is-primary" v-for="mechanic in mechanics" :key="mechanic">{{mechanic}}</b-tag>
              </b-taglist>

              <hr>

              <h2 class="subtitle">{{$t('boardgame.categories')}}</h2>
              <b-taglist>
                <b-tag class="is-primary" v-for="category in categories" :key="category">{{category}}</b-tag>
              </b-taglist>
            </div>
          </div>

          <hr>

          <h1 class="title">{{$t('boardgame.video')}}</h1>
          <template v-if="!youtubeId">
            <b-field :label="$t('boardgame.youtube_url')">
              <b-input v-model="videoUrl" />
            </b-field>
            <button class="button is-primary" @click="saveVideo">{{$t('button.save')}}</button>
          </template>
          <p v-else class="has-text-centered">
            <youtube :video-id="youtubeId" />
          </p>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import HeroTitlePageLayout from '@/components/layout/HeroTitlePageLayout';
import BoardGame from '@/utils/api/BoardGame';
import BgcDuration from '@/components/utils/BgcDuration';

export default {
  components: {
    HeroTitlePageLayout,
    BgcDuration
  },
  data() {
    return {
      boardGame: null,
      loading: true,
      error: false,
      videoUrl: ''
    };
  },
  computed: {
    idBoardGame() {
      return this.$route.params.id;
    },
    bggUrl() {
      return 'https://boardgamegeek.com/boardgame/' + this.boardGame.bgg_id;
    },
    categories() {
      return this.boardGame.category.split(',');
    },
    mechanics() {
      return this.boardGame.mechanic.split(',');
    },
    youtubeId() {
      let url = this.boardGame.gameplay_video_url;
      if(!url) {
        return;
      }

      let regex = new RegExp('\\?v=(.*)');
      let match = url.match(regex);
      return match ? match[1] : null;
    },
    playerCountDisplay() {
      if (this.boardGame.min_players == this.boardGame.max_players) {
        return this.boardGame.min_players;
      }

      return `${this.boardGame.min_players} - ${this.boardGame.max_players}`;
    }
  },
  methods: {
    async saveVideo() {
      let updatedBg = this.boardGame.clone();
      updatedBg.gameplay_video_url = this.videoUrl;
      try {
        await updatedBg.save();
        this.boardGame.gameplay_video_url = updatedBg.gameplay_video_url;
      }
      catch(error) {
        console.log(error);
      }
    }
  },
  async created() {
    try {
      this.boardGame = await BoardGame.fetch(this.idBoardGame);
      console.log(this.boardGame);
    }
    catch(error) {
      console.log(error);
      this.error = true;
    }
    this.loading = false;
  }
};
</script>

<style scoped>
.image-details {
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
}

.boardgame-img {
  max-height: 50vh;
}

>>> iframe {
  height: 360px;
}
</style>
