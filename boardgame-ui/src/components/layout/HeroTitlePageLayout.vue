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

    <div class="hero-foot">
      <slot name="footer">
        <nav v-if="tabs" class="tabs is-boxed">
          <div class="container">
            <ul>
              <router-link v-for="tab in tabs" :key="tab.name" :to="{name: tab.name}" :exact="tab.exact" tag="li">
                <a class="navbar-item">{{tab.text}}</a>
              </router-link>
            </ul>
          </div>
        </nav>
      </slot>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HeroTitlePageLayout',
  props: {
    title: String,
    tabs: Array
  }
};
</script>
