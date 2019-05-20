<template>
  <div id="app">
    
    <router-view />

  </div>
</template>

<script>


export default {
  name: 'App'
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.my-form{
    width: 30%;
    margin: auto;
  }
  button {
    margin-top: 5%;
    width: 100%;
  }
  .main-view{
    width: 80%;
    margin: auto;
  }
  .flex{
    display: flex;
    justify-content: space-between;
  }
  .col-2{
    width: 45%;
  }

  .col-2 ul{
    text-align: left;
  }
</style>
