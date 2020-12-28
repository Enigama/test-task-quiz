# vue-multi-step
```
Сделать мультистеп форму-опросник с несколькими вопросами.
Один вопрос = один экран.
Варианты ответов сделать как radio input.
Результат сохранять как массив значений.

Проверять наличие необходимых значений которые находятся в массиве show_if.
Проводить валидацию каждого степа, если не выбрана ни одна опция - делать disabled кнопку next step.

Сделать кнопку prev step, которая выполняла бы переход к предыдущему шагу.
После последнего вопроса выводить результат опроса.

Сделать кнопку Restart для этой формы, чтоб можно было заново пройти опрос.

В плане верстки, компоненты можешь брать из любого фреймворка (Bootstrap, Bulma, etc.) по твоему желанию.
```



## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Install json server
```
yarn add -g json-server
```

### Run json server
```
run on public folder
json-server --watch test-quiz.json
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
