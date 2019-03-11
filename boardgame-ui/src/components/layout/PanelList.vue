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

};
</script>

<style scoped>

</style>