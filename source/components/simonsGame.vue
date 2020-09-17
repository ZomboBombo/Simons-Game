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

      <p class="game__loss-message">You lose...</p>
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

        // *** DOM-elements ***
        var tiles = document.querySelectorAll('.tiles__item');
        var difficultyTogglers = document.querySelectorAll('.difficulty-levels input[name=difficulty]');
        var gameOverMessage = document.querySelector('.game__loss-message');

        // *** Data Variables ***
        var arrayOfTileObjects = [];
        var DifficultyLevel = {
          easy: 1500,
          medium: 1000,
          hard: 400
        };

        /*
          __________________________________

          ----------- MAIN LOGIC -----------
          __________________________________

        */
        gameOverMessage.classList.remove('game__loss-message--show');

        Array.from(difficultyTogglers).forEach(element => {
          element.setAttribute('disabled', 'disabled');
        });


        var getRandomTileObject = function () {
          return arrayOfTileObjects[Math.floor(FIRST_ELEMENT + Math.random() * tiles.length)];
        };


        var getTileObject = function (tile, index) {          
          return {
            name: tile,
            sound: new Audio('./sounds/' + index + '.mp3')
          };
        };


        var playSound = function (targetObject) {
          for (var i = 0; i < arrayOfTileObjects.length; i++) {
            if (arrayOfTileObjects[i].name.classList.value === targetObject.classList.value) {
              arrayOfTileObjects[i].sound.play();
            }
          }
        };

        
        Array.from(tiles).forEach((element, index) => {
          var soundNum = index + 1;
          arrayOfTileObjects.push(getTileObject(element, soundNum));  
        });


        var randomTilesSequence = [getRandomTileObject()];
        var tilesSequenceToGuess = randomTilesSequence.slice();


        // *** Event Listener for click on the tiles ***
        var onTileClick = function (evt) {
          evt.preventDefault();

          if (CAN_CLICK) {
            playSound(evt.target);

            var expectedTile = tilesSequenceToGuess.shift();

            if (expectedTile.name.classList.value === evt.target.classList.value) {
              if (tilesSequenceToGuess.length === ZERO) {
                // --- Start new round---
                setTimeout(() => {
                  randomTilesSequence.push(getRandomTileObject());
                  tilesSequenceToGuess = randomTilesSequence.slice();
                  startFlashing();
                }, 1000);

              }
            } else {
              Array.from(difficultyTogglers).forEach(element => {
                element.removeAttribute('disabled');
              });

              gameOverMessage.classList.add('game__loss-message--show');

              randomTilesSequence = [getRandomTileObject()];
              tilesSequenceToGuess = randomTilesSequence.slice();
              CAN_CLICK = false;
            }
          }
        };

        tiles.forEach(tile => {
          tile.addEventListener('click', onTileClick);
        });


        // *** Function to starting flashing tiles ***
        var getFlashingTile = function (tile, tileSound, speed) {
          for (var i = 0; i < difficultyTogglers.length; i++) {
            if (difficultyTogglers[i].checked) {
              speed = difficultyTogglers[i].id;
            }
          }

          return new Promise (function (resolve, reject) {
            tile.classList.add('active');
            tileSound.play();

            setTimeout(() => {
              console.log('Active tile:', tile);
              tile.classList.toggle('active');

              setTimeout(() => {
                resolve();
              }, 300);
            }, DifficultyLevel[speed]);
          });
        };


        var startFlashing = async function () {
          CAN_CLICK = false;

          for (var tileObject of tilesSequenceToGuess) {
            await getFlashingTile(tileObject.name, tileObject.sound);
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