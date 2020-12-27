<template>
  <div class="quiz">
    <Spinner v-if="isLoading"/>

    <template v-else>
      <div v-if="steps && !isError"
           class="quiz__body"
      >
        <template v-for="(item, index) in quiz">
          <Question v-if="currentStep === index + 1"
                    :title="item.title"
                    :key="item.key"
          >
            <template v-for="answer in item.answers">
              <Answer :answer="answer"
                      :index="index"
                      :key="answer.value"
                      :key-value="item.key"
                      @handlerAnswer="handlerAnswer"
              />
            </template>
          </Question>
        </template>

        <div class="quiz__actions">
          <button @click="changeStep(-1)" :disabled="currentStep === 1">prev step</button>
          <button @click="changeStep(+1)" :disabled="false">next step</button>
        </div>
      </div>

      <div v-else-if="isError"
           class="quiz__empty"
      >
        No quiz question
      </div>
    </template>
  </div>
</template>

<script>
import axios from 'axios';
import Spinner from "./spinner/Spinner";
import Question from "./question/Question";
import Answer from "./answer/Answer";

export default {
  name: 'Quiz',
  components: {Question, Spinner, Answer},
  data() {
    return {
      isLoading: true,
      quiz: [],
      results: [],

      steps: 0,
      currentStep: 1,

      //error
      isError: false,

      //flag for sub questions
      isSub: false,
    }
  },

  mounted() {
    this.isLoading = true;

    axios.get('http://localhost:3000/data')
        .then(({data}) => {
          this.steps = data.length;

          data.forEach((item) => {
            this.quiz.push(item)

            item.answers.forEach((ans) => {
              const sub = ans.sub;
              if (sub) {
                this.quiz.push(sub);
              }
            })
          })
        })
        .catch(err => {
          this.isError = true;
          console.log(err.response);
        })
        .finally(() => {
          this.isLoading = false;
        })
  },

  methods: {
    changeStep(count) {
      const newCount = this.currentStep + count;
      if (newCount > this.steps || newCount <= 0) return;

      this.currentStep = newCount;
    },

    handlerAnswer({target, key}) {
      const value = target.value;

      if (!this.results.length) {
        this.results.push({key, value})
      } else {
        const existAnswer = this.results.some(item => item.key === key);

        if (existAnswer) {
          this.results.forEach(item => {
            if (item.key === key) {
              item.value = value;
              return false
            }
            console.log('sss')
          })
        } else {
          this.results.push({key, value})
        }
      }
    }
  }
}
</script>

<style scoped>

.quiz {
  display: flex;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.quiz__body {
  flex-direction: column;
}
</style>
