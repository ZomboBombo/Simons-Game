<template>
  <section class="game">
    <h2 class="visually-hidden">Simons Game Application</h2>

    <div class="game__tiles tiles">
      <div class="tiles__group tiles__group--top">
        <button class="tiles__item tiles__item--top-left"></button>
        <button class="tiles__item tiles__item--top-right"></button>
      </div>
      <div class="tiles__group tiles__group--bottom">
        <button class="tiles__item tiles__item--bottom-left"></button>
        <button class="tiles__item tiles__item--bottom-right"></button>
      </div>
    </div>

    <div class="game__difficulty">
      <p class="game__difficulty-heading">Difficulty levels</p>

      <ol class="difficulty-levels">
        <li class="difficulty-levels__item">
          <input type="radio" name="difficulty-easy" id="easy" checked>
          <label for="easy">Easy</label>        
        </li>

        <li class="difficulty-levels__item">
          <input type="radio" name="difficulty-medium" id="medium">
          <label for="medium">Medium</label>        
        </li>

        <li class="difficulty-levels__item">
          <input type="radio" name="difficulty-hard" id="hard">
          <label for="hard">Hard</label>        
        </li>
      </ol>
    </div>
  </section>
</template>


<script>
  module.exports = {
    data() {
      return {
        
      }
    },
    methods: {}
  }
</script>