<template>
    <section class="hero is-secondary">
        <div class="hero-body">
            <div class="container">
                <h1 class="title">
                  {{this.title}}
                </h1>
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
