<template>
  <div id="app">
    <transition name="fade">
      <router-view />
    </transition>
  </div>
</template>

<script>


export default {
  name: 'App'
};
</script>

<style lang="scss">
  @import "./src/css/index.scss";

</style>
