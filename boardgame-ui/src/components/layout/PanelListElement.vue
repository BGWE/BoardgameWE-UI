<template>
  <div class="card" v-bind:class="{'element-open': this.isOpen}">

    <header class="card-header" @click="isOpen = !isOpen">
      <slot name="img"></slot>
      <p class="card-header-title">
        <slot name="title"></slot>
      </p>

      <a class="card-header-icon" aria-label="more options">
        <span class="icon">
          <i class="fas" aria-hidden="true" v-bind:class="{'fa-angle-down': !this.isOpen, 'fa-angle-up': this.isOpen}"></i>
        </span>
      </a>
    </header>

    <transition name="fade">
      <div class="card-content" v-if="this.isOpen">
        <slot name="content"></slot>
      </div>
    </transition>

    <transition name="fade">
      <div class="card-footer" v-if="this.isOpen">
        <slot name="buttons"></slot>
      </div>
    </transition>

    <footer class="card-footer">
      <slot class="card-footer-item" name="footer"></slot>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isOpen: false
    };
  },

  methods: {
    // elementClicked: function () {
    //   // console.log('selected %s', index);
    //   this.isExpanded = !this.isExpanded;
    // },
    open() {
      this.isOpen = true;
    },

    close(){  
      this.isOpen = false;
    }
  }
};
</script>

<style scoped>
  .expanded {
    margin-top: 1.5em;
    margin-bottom: 1.5em;
  }

  .panel-block {
    border: 0px;
    padding: 0px;
    padding-bottom: 0.5em;

    max-width: 40em;
    display: flex;
    justify-content: center;
  }

  .panel-block:hover {
    background-color: transparent;
  }

  figure.image {
    text-align: center;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 32px;
    position: absolute;
    left: 15px;
    top: 50%;
    margin-top: -32px;
  }

  .card {
    margin-bottom: 0.8em;
  }

  .card-header {
    position: relative;
  }

  .card-header-title {
    padding: 1.2em;
    padding-left: 6em;
  }

  .card-content {
    padding-bottom: 0em;
    padding: 1.2em;
    
  }

  .element-open {
    margin-top: 1.8em;
    margin-bottom: 1.8em;
  }

</style>