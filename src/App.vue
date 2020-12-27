<template>
  <div id="app">
    <Quiz/>
  </div>
</template>

<script>
import Quiz from './components/quiz.vue'

export default {
  name: 'App',
  components: {
    Quiz
  }
}
</script>

<style>
html{
  table-layout: fixed;
  min-height: 100%;
}

html, body {
  display: flex;
  flex-direction: column;
  width: 100%;
}

body {
  flex-grow: 1;
}

body, h1, h2, h3, h4, h5, h6, p, ol, ul{
  margin: 0;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
