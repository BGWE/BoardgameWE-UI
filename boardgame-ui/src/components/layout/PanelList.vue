<template>
  <div class="panel">
    <PanelListElement
      v-for="(el, index) in elements"
      v-bind:key="index">
      <template v-slot:title>
        {{el.title}}
      </template>

      <template v-slot:content>
        <div v-html="el.content"></div>
      </template>

      <template v-slot:footer>
        <div class="card-footer-item" v-html="el.footer.left"></div>
      </template>

    </PanelListElement>
  </div>
</template>

<script>
import PanelListElement from '@/components/layout/PanelListElement';
export default {
  props: {
    elements: {
      required: true
    }
  },

  components: {
    PanelListElement
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
  }

  .panel-block:hover {
    background-color: transparent;
  }

  .expanded {
    margin-top: 1.5em;
    margin-bottom: 1.5em;
  }
</style>