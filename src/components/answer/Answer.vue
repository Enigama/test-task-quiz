<template>
  <label
      class="quiz__label"
      @change="handlerAnswer($event)"
  >
    <input type="radio"
           class="quiz__input"
           :name="`quiz_${keyValue}`"
           :value="answer.value"
    />
    <span class="quiz__info">
      {{ answer.title }}
    </span>
  </label>
</template>

<script>
export default {
  name: "Answer",
  props: {
    answer: {
      type: Object,
      required: true,
    },
    index: {
      type: [Number, String]
    },
    keyValue: Number,
  },

  methods: {
    handlerAnswer({target}) {
      const haveSub = this.answer.sub;
      this.$emit('handlerAnswer', {target, key: this.keyValue, haveSub: !!haveSub})
    },
  }
}
</script>

<style scoped>
.quiz__label {
  display: block;
}
</style>