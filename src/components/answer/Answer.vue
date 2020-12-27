<template>
  <label
      :class="['quiz__label', isChecked(answer.value) && 'active']"
      @change="handlerAnswer($event)"
  >
    <input type="radio"
           class="quiz__input"
           name="quiz"
           :value="answer.value"
           :checked="isChecked(answer.value)"
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
    keyValue: Number,
    results: Array,
  },

  methods: {
    handlerAnswer({target}) {
      const haveSub = this.answer.sub;
      this.$emit('handlerAnswer', {target, key: this.keyValue, haveSub: !!haveSub})
    },

    isChecked(value) {
      const isSelected = this.results.some(item => (+item.value === +value && +item.key === +this.keyValue));
      isSelected ? this.$emit('selected', isSelected) : null;

      return isSelected;
    },
  }
}
</script>

<style scoped>
.quiz__label {
  display: block;
}

.quiz__label:hover {
  cursor: pointer;
}

.quiz__label + .quiz__label {
  margin-top: 10px;
}

.quiz__label .active {
  background-color: green;
}
</style>