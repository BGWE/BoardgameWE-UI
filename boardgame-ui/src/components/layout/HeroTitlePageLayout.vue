<template>
  <section class="hero is-secondary">
    <div class="hero-body">
      <div class="container">
        <slot>
          <h1 class="title">
            {{this.title}}
          </h1>
        </slot>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HeroTitlePageLayout',
  props: ['title']
};
</script>
