<template>
  <div class="quiz">
<!--    <tippy to="myTrigger" arrow>-->
<!--      <div>-->
<!--        <h3>Header</h3>-->
<!--        <p style="color: black">data binding</p>-->
<!--        <button>Click</button>-->
<!--      </div>-->
<!--    </tippy>-->

    <Spinner v-if="isLoading"/>

    <template v-else>
      <form v-if="steps && !isError"
            class="quiz__body"
      >
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
          <button :class="['btn', isNext ? 'btn-outline-primary' : 'btn-outline-secondary']"
                  type="button"
                  @click="changeStep(+1)"
                  :disabled="!isNext"
          >
            next step
          </button>
        </div>
      </form>

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

      //flag for sub questions
      isSub: false,

      //flag for next question
      isNext: false,
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
    isNextStep(value) {
      this.isNext = value;
    },

    changeStep(count) {
      console.log(this.quiz[this.currentStep + count], this.currentStep, count)
      const newCount = this.currentStep + count;

      if (newCount > this.steps || newCount <= 0) return;

      this.currentStep = newCount;
      this.isNext = !(count > 0 && this.currentStep !== 1);
    },

    handlerAnswer({target, key}) {
      this.isNext = true;

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
    },

    checkShowIf(values) {
      let countEqual = 0;

      values.forEach(item => {
        this.results.forEach(({value}) => {
          +value === +item ? countEqual++ : null
        })
      })

      const isShowQuestion = values.length <= countEqual;

      if (!isShowQuestion) {
        this.changeStep(this.isNext ? -1 : +1);
      }

      return isShowQuestion;
    },
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
</style>
