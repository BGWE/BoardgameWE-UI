<template>

  <div class="card">
    <header class="card-header">
      <p class="card-header-title">
        <slot name="title"></slot>
      </p>
      <!-- <a class="card-header-icon">
          <b-icon :icon="props.open ? 'menu-down' : 'menu-up'"></b-icon>
      </a> -->

      <span class="card-header-icon" aria-label="more options">
        <span class="icon">
          <i class="fas fa-angle-down" aria-hidden="true"></i>
        </span>
      </span>
    </header>
    <div class="card-content">
      <slot name="content"></slot>
    </div>
    <footer class="card-footer">
      <slot class="card-footer-item" name="footer"></slot>
    </footer>
  </div>

  <!-- <b-collapse 
    class="card" 
    aria-id="contentIdForA11y3" 
    :open="false"
    v-bind:class="{opened: isOpen}"
    v-on:open="open()"
    v-on:close="close()">
      <div
          slot="trigger" 
          slot-scope="props"
          class="card-header"
          role="button"
          aria-controls="contentIdForA11y3">
          <p class="card-header-title">
              <slot name="title"></slot>
          </p>
          <a class="card-header-icon">
              <b-icon
                  :icon="props.open ? 'menu-down' : 'menu-up'">
              </b-icon>
          </a>
      </div>
      <div class="card-content">
              <slot name="content"></slot>
      </div>
      <footer class="card-footer">
          <slot class="card-footer-item" name="footer"></slot>
      </footer>
  </b-collapse> -->
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
    top: 10px;
  }
/* 
  .card {
    width: 600px;
    margin: auto;
  }

  .card-header {
    padding-left: 90px;
  } */
</style>