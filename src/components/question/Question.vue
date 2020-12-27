<template>
  <div class="quiz__item">
    <h2 class="quiz__title">{{ title }}</h2>
    <slot/>
  </div>
</template>

<script>

export default {
  name: "Question",
  props: {
    title: String,
  }
}
</script>

<style scoped>

</style>