<template>
  <a 
    v-on:click="elementClicked()"
    class="panel-block"
    v-bind:class="{expanded: isExpanded}">

    <div class="card">
      <header class="card-header">
            <p class="card-header-title">
              <slot name="title"></slot>
            </p>
            <a href="#" class="card-header-icon" aria-label="more options">
              <span class="icon">
                <i class="fas fa-angle-down" aria-hidden="true"></i>
              </span>
            </a>
      </header>

      <div class="card-content" v-if="isExpanded">
          <slot name="content"></slot>
      </div>

      <footer class="card-footer">
        <div class="card-footer-item">
          <slot name="footer"></slot>
        </div>
      </footer>
    </div>
  </a>
</template>

<script>
export default {
  data() {
    return {
      isExpanded: false
    }
  },

  methods: {
    elementClicked: function () {
      // console.log('selected %s', index);
      this.isExpanded = !this.isExpanded;
    },
  },
}
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
</style>