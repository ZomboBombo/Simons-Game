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
    methods: {
      onPlayClick () {
        // *** Constants ***
        var CAN_CLICK = false; // --- Boolean flag to toggle the ability to click on tiles.
        var FIRST_ELEMENT = 0; // --- First array element
        var ZERO = 0;
        var ONE = 1;
        var BREAK_TIME = 1000;
        var TIMING_INTERVAL = 300;

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

          =========== MAIN LOGIC ===========
          __________________________________

        */

        /* ====================== Preparatory Settings ====================== */
        // --- Hiding a loss message  ---
        gameOverMessage.classList.remove('game__loss-message--show');

        // --- Disabling difficulty togglers ---
        Array.from(difficultyTogglers).forEach(element => {
          element.setAttribute('disabled', 'disabled');
        });


        // --- Template for tile object ---
        var getTileObject = function (tile, index) {          
          return {
            name: tile,
            sound: new Audio('./sounds/' + index + '.mp3')
          };
        };


        // --- Getting a random tile ---
        var getRandomTileObject = function () {
          return arrayOfTileObjects[Math.floor(FIRST_ELEMENT + Math.random() * tiles.length)];
        };


        // --- Play tile sound function ---
        var playSound = function (targetObject) {
          for (var i = 0; i < arrayOfTileObjects.length; i++) {
            if (arrayOfTileObjects[i].name.classList.value === targetObject.classList.value) {
              arrayOfTileObjects[i].sound.play();
            }
          }
        };

        
        // --- Populating an array of tile objects with data ---
        Array.from(tiles).forEach((element, index) => {
          var soundNum = index + ONE;
          arrayOfTileObjects.push(getTileObject(element, soundNum));  
        });


        /* ====================== Main Settings ====================== */
        var randomTilesSequence = [getRandomTileObject()]; // --- Sequence of random tiles
        var tilesSequenceToGuess = randomTilesSequence.slice(); // --- Sequence of tiles to guess


        // *** Event Listener for click on the tiles ***
        var onTileClick = function (evt) {
          evt.preventDefault();

          if (CAN_CLICK) {
            playSound(evt.target);

            // --- Expected tile is a first tile in sequence to guess ---
            var expectedTile = tilesSequenceToGuess.shift();


            /*
              If expected tile matches the clicked tile,
              starting new round.

              Else — Game Over.
            */
            if (expectedTile.name.classList.value === evt.target.classList.value) {
              if (tilesSequenceToGuess.length === ZERO) {
                /*
                * --- Start new round---
                */

                // --- Break before starting a new round ---
                setTimeout(() => {
                  randomTilesSequence.push(getRandomTileObject());
                  tilesSequenceToGuess = randomTilesSequence.slice();

                  startFlashing();
                }, BREAK_TIME);

              }
            } else {
              /*
              * --- Game Over---
              */

              // --- Activate of difficulty togglers ---
              Array.from(difficultyTogglers).forEach(element => {
                element.removeAttribute('disabled');
              });

              // --- Showing the message about the loss ---
              gameOverMessage.classList.add('game__loss-message--show');

              randomTilesSequence = [getRandomTileObject()];
              tilesSequenceToGuess = randomTilesSequence.slice();

              // --- Prohibition of clicking on tiles after a loss ---
              CAN_CLICK = false;
            }
          }
        };


        // --- Attaching event listeners of click on tiles ---
        tiles.forEach(tile => {
          tile.addEventListener('click', onTileClick);
        });


        // *** Function for Getting Flashing tile ***
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
              tile.classList.toggle('active');

              setTimeout(() => {
                resolve();
              }, TIMING_INTERVAL);
            }, DifficultyLevel[speed]);
          });
        };


        // --- Function to starting flashing ---
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