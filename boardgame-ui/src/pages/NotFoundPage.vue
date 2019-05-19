<template>
  <div class="container">
    <div class="section">
      <img src="@/assets/4onion4.png">
      <h1 class="title">{{$t('error.page-not-found')}}</h1>
    </div>
  </div>
</template>


<style lang="scss" scoped>
@import "@/assets/colors.scss";

img {
  max-height: 25vh;
}

.section {
  height: 75vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

h1 {
  margin-top: 1em;
  color: $secondary;
}
</style>
