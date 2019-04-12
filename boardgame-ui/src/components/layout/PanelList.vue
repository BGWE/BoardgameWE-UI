<template>
  <div class="panel">
    <slot></slot>
  </div>  
</template>

<script>
export default {

};
</script>

<style scoped>
  .panel > .opened {
    margin-top: 20px;
    margin-bottom: 20px
  }

  .panel { 
    max-width: 500px;
    margin: auto;
  }

</style>
