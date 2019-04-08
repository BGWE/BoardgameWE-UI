<template>
  <div class="panel">
    <a
      v-for="(el, index) in elements"
      v-on:click="elementSelected(index)"
      class="panel-block"
      v-bind:class="{expanded: isElementExpanded(index)}"
      :key="index">
        <div class="card">
           <figure class="image is-64x64" :style="{backgroundImage: `url('${el.image}')`}"></figure>
          <header class="card-header">
            <p class="card-header-title">
              {{el.title}}
            </p>
            <a href="#" class="card-header-icon" aria-label="more options">
              <span class="icon">
                <i class="fas fa-angle-down" aria-hidden="true"></i>
              </span>
            </a>
          </header>

          <div class="card-content" v-if="isElementExpanded(index)">
          </div>

          <div class="card-content" v-if="isElementExpanded(index)">
            <div class="content">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris.
              <a href="#">@bulmaio</a>. <a href="#">#css</a> <a href="#">#responsive</a>
              <br>
              <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
            </div>
          </div>
          <footer class="card-footer">
            <div class="card-footer-item" v-html="el.footer.left"></div>
            <!-- <div class="card-footer-item" v-html="el.footer.right"></div> -->
            <!-- <a href="#" class="">Edit</a> -->
          </footer>
        </div>
      </a>
  </div>
</template>

<script>
export default {
  props: {
    elements: {
      required: true
    }
  },

  data() {
    return {
      elementsState: this.elements.map(x => ({...x && { selected: false }}))
    };
  },

  methods: {
    elementSelected: function (index) {
      // console.log('selected %s', index);
      this.elementsState[index].selected = !this.elementsState[index].selected;
    },

    isElementExpanded: function (index) {
      // console.log('index: ', index);
      // console.log('this.elementsState: ', index);
      return this.elementsState[index].selected;
    }
  },
};
</script>

<style scoped>
  .panel-block {
    border: 0px;
    padding: 0px;
    padding-bottom: 0.5em;

    max-width: 40em;
    display: flex;
    justify-content: center;

    margin-bottom: 1.5em;
  }

  .panel-block:hover {
    background-color: transparent;
  }

  .card-header {
    padding-left: 90px;
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

  .card {
    width: 600px;
    margin: auto;
  }
</style>
