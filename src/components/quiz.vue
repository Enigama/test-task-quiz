<template>
  <div class="quiz">
    <Spinner v-if="isLoading"/>

    <template v-else>
      <div v-if="steps && !isError"
           class="quiz__body"
      >
        <template v-if="!isDone">
          <template v-for="(item, index) in quiz">
            <Question v-if="currentStep === index + 1 && (!item.show_if || checkShowIf(item.show_if))"
                      :title="item.title"
                      :key="item.key"
            >
              <template v-for="answer in item.answers">
                <Answer :answer="answer"
                        :key="answer.value"
                        :key-value="item.key"
                        :results="results"
                        :title="item.title"
                        @selected="isNextStep"
                        @handlerAnswer="handlerAnswer"
                />
              </template>
            </Question>
          </template>

          <div class="quiz__actions">
            <button :class="['btn',  currentStep === 1 ? 'btn-outline-secondary' : 'btn-outline-primary']"
                    type="button"
                    @click="changeStep(-1)"
                    :disabled="currentStep === 1"
            >
              prev step
            </button>

            <template>
              <button v-if="isNext"
                      :class="['btn', isNext ? 'btn-outline-primary' : 'btn-outline-secondary']"
                      type="button"
                      @click="changeStep(+1)"
                      :disabled="!isNext"
              >
                next step
              </button>

              <button v-else
                      :class="['btn', isNext ? 'btn-outline-primary' : 'btn-outline-secondary']"
                      type="button"
                      content="Choose one of the answers"
                      v-tippy
              >
                next step
              </button>
            </template>
          </div>
        </template>

        <div v-else class="quiz__results">
          <h3 class="quiz__result-title">The quiz is done!!!</h3>

          <div v-for="result in results"
               :key="result.title"
               class="quiz__result"
          >
            <span><strong>{{ result.title }}: </strong></span>
            <span>{{ result.value }}</span>
          </div>

          <button type="button"
                  class="btn btn-outline-info quiz__reset"
                  @click="restart"
          >
            Restart
          </button>
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
  components: {
    Question,
    Spinner,
    Answer,
  },
  data() {
    return {
      isLoading: true,
      quiz: [],
      results: [],

      steps: 0,
      currentStep: 1,

      //error
      isError: false,

      //flag for next question
      isNext: false,

      //flag done quiz
      isDone: false,
    }
  },

  mounted() {
    this.isLoading = true;

    axios.get('http://localhost:3000/data')
        .then(({data}) => {
          data.forEach((item) => {
            this.quiz.push(item)

            item.answers.forEach((ans) => {
              const sub = ans.sub;
              if (sub) {
                this.quiz.push(sub);
              }
            })
          })

          this.steps = this.quiz.length;
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
    isNextStep(value) {
      this.isNext = value;
    },

    changeStep(count) {
      const newCount = this.currentStep + count;

      this.isDone = newCount > this.steps;

      if (newCount > this.steps || newCount <= 0) return;

      this.currentStep = newCount;
      this.isNext = !(count > 0 && this.currentStep !== 1);
    },

    handlerAnswer({title, target, key}) {
      this.isNext = true;

      const value = target.value;

      if (!this.results.length) {
        this.results.push({title, key, value})
      } else {
        const existAnswer = this.results.some(item => item.key === key);

        if (existAnswer) {
          this.results.forEach(item => {
            if (item.key === key) {
              item.value = value;
              return false
            }
          })
        } else {
          this.results.push({title, key, value})
        }
      }
    },

    checkShowIf(values) {
      let countEqual = 0;

      values.forEach(item => {
        this.results.forEach(({value}) => {
          +value === +item ? countEqual++ : null
        })
      })

      //if need full check values from show_if uncomment this variable and replace !countEqual to isShowQuestion and return isShowQuestion
      // const isShowQuestion = values.length <= countEqual;

      if (!countEqual) {
        this.changeStep(this.isNext ? -1 : +1);
      }

      return countEqual;
    },

    restart() {
      this.currentStep = 1;
      this.results = [];
      this.isDone = false;
      this.isNext = false;
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

.quiz__actions {
  margin-top: 40px;
  min-width: 300px;
  display: flex;
  justify-content: space-between;
}

.quiz__result-title {
  margin-bottom: 15px;
}

.quiz__result {
  display: flex;
  justify-content: space-between;
}

.quiz__result + .quiz__result {
  margin-top: 5px;
}

.quiz__reset {
  margin-top: 20px;
}

.btn {
  transition: background-color 0.3s;
}
</style>
