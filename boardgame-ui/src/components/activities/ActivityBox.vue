<template>
    <div v-if=activity class="activity-container">
        <article class="media" v-if="activity.type === 'event/join'">
            <div class="media-left calendar-media-left">
                <figure class="is-64x64"><span><i class="fa-3x far fa-calendar-alt"></i></span></figure>
            </div>
            <div class="media-content">
                <i18n path="activity.event.join"> <strong place="eventName">{{activity.event.name}}</strong> </i18n>.
                <br/>
                <p class="activity-datetime">{{activity.datetime}}</p>
            </div>
        </article>
        <article class="media" v-if="activity.type === 'game/play'">
            <div class="media-left">
                <figure class="image is-64x64"><img class="is-rounded" :src=activity.board_game.thumbnail /></figure>
            </div>
            <div class="media-content">
                <i18n path="activity.game.played"> <strong place="gameName">{{activity.board_game.name}}</strong> </i18n>.
                <br/>
                <p class="activity-datetime">{{activity.datetime}}</p>
            </div>
        </article>
        <article class="media" v-if="activity.type === 'library/add'">
            <div class="media-left">
                <figure class="image is-64x64"><img class="is-rounded" :src=activity.board_game.thumbnail /></figure>
            </div>
            <div class="media-content">
                <i18n path="activity.library.added_game"> 
                    <strong place="gameName">{{activity.board_game.name}}</strong> 
                </i18n>.
                <br/>
                <p class="activity-datetime">{{activity.datetime}}</p>
            </div>
        </article>
    </div>
    <div v-else-if=!activity></div>
</template>


<script>
export default {
  name: 'ActivityBox',
  props: {
    activity: {
      required: true
    }
  },
};
</script>

<style scoped>
.activity-container {
    margin-top: 5px;
    margin-bottom: 5px;
    height: 64px;
}

.activity-datetime {
    color: #000000;
    font-size: 0.8em;
}

img {
    max-width: 64px;
    max-height: 64px;
}
</style>
