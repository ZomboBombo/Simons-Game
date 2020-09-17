<template>
  <section class="game">
    <h2 class="visually-hidden">Simons Game Application</h2>

    <div class="game__tiles tiles">
      <div class="tiles__group tiles__group--top">
        <button type="button" class="tiles__item tiles__item--top-left"></button>
        <button type="button" class="tiles__item tiles__item--top-right"></button>
      </div>
      <div class="tiles__group tiles__group--bottom">
        <button type="button" class="tiles__item tiles__item--bottom-left"></button>
        <button type="button" class="tiles__item tiles__item--bottom-right"></button>
      </div>
    </div>

    <div class="game__difficulty">
      <p class="game__difficulty-heading">Difficulty levels</p>

      <ol class="difficulty-levels">
        <li class="difficulty-levels__item">
          <input type="radio" name="difficulty" id="easy" checked>
          <label for="easy">Easy</label>        
        </li>

        <li class="difficulty-levels__item">
          <input type="radio" name="difficulty" id="medium">
          <label for="medium">Medium</label>        
        </li>

        <li class="difficulty-levels__item">
          <input type="radio" name="difficulty" id="hard">
          <label for="hard">Hard</label>        
        </li>
      </ol>

      <button type="button" class="game__start-button" @click="onPlayClick">Play</button>
    </div>
  </section>
</template>


<script>
  module.exports = {
    data() {
      return {
        
      }
    },
    methods: {
      onPlayClick () {
        // *** Constants ***
        var CAN_CLICK = false;
        var FIRST_ELEMENT = 0;
        var ZERO = 0;


        // *** Helper Utilities ***
        var getRandomNumber = function (min, max) {
          return Math.floor(min + Math.random() * max);
        };

        console.log('Click!');


        /*
          __________________________________

          ----------- MAIN LOGIC -----------
          __________________________________

        */
        var tiles = document.querySelectorAll('.tiles__item');

        var getRandomTile = function () {
          return tiles[getRandomNumber(FIRST_ELEMENT, tiles.length)];
        };

        var randomTilesSequence = [ getRandomTile() ];
        var tilesSequenceToGuess = randomTilesSequence.slice();


        // *** Event Listener for click on the tiles ***
        var onTileClick = function (evt) {
          if (CAN_CLICK) {
            var expectedTile = tilesSequenceToGuess.shift();

            if (expectedTile === evt.target) {
              console.log('This is target:', evt.target);

              if (tilesSequenceToGuess.length === ZERO) {
                // --- Start new round---
                randomTilesSequence.push(getRandomTile());
                tilesSequenceToGuess = randomTilesSequence.slice();
                startFlashing();
              }
            } else {
              alert('Game Over!');
            }
          }
        };

        tiles.forEach(tile => {
          tile.addEventListener('click', onTileClick);
        });


        // *** Function to starting flashing tiles ***
        var getFlashingTile = function (tile) {
          return new Promise (function (resolve, reject) {
            tile.classList.add('active');

            setTimeout(() => {
              console.log('Active tile:', tile);
              tile.classList.toggle('active');

              setTimeout(() => {
                resolve();
              }, 100);
            }, 300);
          });
        };


        var startFlashing = async function () {
          CAN_CLICK = false;

          for (var tileElement of tilesSequenceToGuess) {
            await getFlashingTile(tileElement);
          }

          CAN_CLICK = true;
        };

        startFlashing();
      }
    }
  }
</script>


<style>
  .active {
    background-color: red;
  }
</style>