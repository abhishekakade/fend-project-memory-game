/*
 * Create a list that holds all of your cards
 */
const container = document.getElementById("container");
const ul = document.getElementById("ul");
let cards = document.getElementsByClassName("card");
let deck = Array.from(cards);
let matchingCardsObject = document.getElementsByClassName("match");
let matchingCardsArray = Array.from(matchingCardsObject);
let hasGameStartedYet = false;
let hasPlayerWon = false;
let clickCounter = 0;
let starsArray = document.getElementsByClassName("fa-star");
let starRating = 0;

let varModal = document.getElementsByClassName("modal")[0];

let modalBtn = document.getElementById("modal-btn");

modalBtn.addEventListener("click", function() {
  resetGame();
  varModal.classList.remove("show-modal");

  // TO START THE TIMER FUNCTION AFTER CLOSING MODAL
  timerFunc();
});


// TIMER VARIABLES
let varMinutes = 0;
let varSeconds = 0;
let numOfSeconds = 0;
let varTimer;
varTimer = document.getElementById("timer");
varTimer.textContent = "00 : 00";

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
let shuffle = function(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

// TIMER FUNCTION

let shouldTimerStop = false;

let startTimer = function() {
  varTimer.textContent = `${varMinutes} : ${varSeconds}`;
  varSeconds++;
  numOfSeconds++;
  if (varSeconds < 10) {
    varSeconds = "0" + varSeconds;
  }

  if (varSeconds == 60) {
    varMinutes++;
    varSeconds = 0;
  }
  
};

function timerFunc() {
  let clearId = setInterval(function() {
    if (shouldTimerStop && hasPlayerWon) {
      clearInterval(clearId);
      shouldTimerStop = false;
      hasPlayerWon = false;
      hasGameStartedYet = false;
    } 
    
    else {
      startTimer();
      hasGameStartedYet = true;
    }
  }, 1000);
  
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

ul.addEventListener("click", cardClicked);


let openCardsArray = [];

console.log(openCardsArray);


function cardClicked(e) {

  console.log(hasGameStartedYet);
  // hasGameStartedYet = true;

  function openCard() {

    if (e.target.classList.contains("card")) {

      // changed to true from false
      if(hasGameStartedYet === false) {

        timerFunc();
        hasGameStartedYet = true;
        //  SO THAT timerFunc CAN RUN clearInterval AND TIMER DOESN'T KEEP RUNNING ON RESTART
      }





      // UPDATE NUMBER OF MOVES/CLICKS

      let moveCounterFunc = function() {
        clickCounter++;
        
        function removeStar() {

          if (clickCounter < 19) {
            starRating = 3;
          }
  
          if(clickCounter > 18 && clickCounter < 26) {
            starRating = 2;
            for (i = 0; i < 3; i++) {
              if (i > 1) {
                starsArray[i].classList.add("hide-star");
              }
            }
          }
        
          else if(clickCounter > 25) {
            starRating = 1;
            for (i = 0; i < 3; i++) {
              if (i > 0) {
                starsArray[i].classList.add("hide-star");
              }
            }
          }
          
        }
        removeStar();




        document.getElementById("num-of-moves").textContent = clickCounter;

        if (clickCounter === 1) {
          document.getElementById("moves").textContent = "Move";
        } else {
          document.getElementById("moves").textContent = "Moves";
        }
      };

      moveCounterFunc();

      // MATCH THE CARDS

      let matchCardsFunc = function() {
        // ADD CLASSNAME OF CLICKED CARDS SYMBOL TO AN ARRAY
        openCardsArray.unshift(e.target.children[0].classList[1]);

        // SHOW THE CLICKED CARD OBVIOUSLY
        e.target.classList.add("show");

        // SAVE CLASSNAME OF CLICKED CARD SYMBOL TO VARIABLE FOR COMPARISON
        let matchingCardClass = openCardsArray[1];
        // SAVE ELEMENTS WITH MATCHING CARDS TO VARIABLE
        let matchingElements = document.getElementsByClassName(
          matchingCardClass
        );

        // TO KEEP THE ARRAY MAX LENGTH = 2
        if (openCardsArray.length >= 2) {
          openCardsArray.length = 2;

          // CONDITION FOR FIRST AND SECOND CLICK MATCH

          if (openCardsArray[0] === openCardsArray[1]) {
            // ADD MATCH CLASS IF CARDS MATCH
            for (let i = 0; i < matchingElements.length; i++) {
              matchingElements[i].parentElement.classList.add("match");

              // THIS FOR GETTING ARRAY LENGTH TO SEE IF ALL CARDS MATCH AND SHOWING A MODAL
              matchingCardsArray.push(matchingElements[i].parentElement);
            }
            console.log("Cards Matched!");
          } else {
            // IF FIRST AND SECOND CLICK DONT MATCH, REMOVE MATCH CLASS
            for (let i = 0; i < matchingElements.length; i++) {
              matchingElements[i].parentElement.classList.remove("show");
            }
          }
        }
      };
      matchCardsFunc();
    }
  }
  openCard();
  // https://review.udacity.com/#!/rubrics/591/view

  // IF ALL ELEMENTS ARE SAME AND IF TOTAL NO OF SAME ELEMS IS 16 SOMETHING LIKE THAT
  if (matchingCardsArray.length === 16) {

    // MODAL - SHOW STAR RATING IN MODAL

    hasPlayerWon = true;
    shouldTimerStop = true;
    // timerFunc();
    varModal.classList.add("show-modal");
    document.getElementById("modal-para").textContent = 
    `You finished in ${varMinutes} minutes ${varSeconds} seconds and ${clickCounter} moves. You get a ${starRating} star rating!`;
    document.getElementsByClassName("close")[0].addEventListener("click", function() {
      varModal.classList.remove("show-modal");
    });

    console.log("Congrats!");

  }
}

function resetGame() {

  console.log(hasGameStartedYet);

  //  ADD ANIMATE ROTATE 360deg
document.querySelector(".restart").classList.add("rotate");

hasGameStartedYet = false;


//  TO REMOVE ALL THE CARDS
while (ul.lastChild) {
  ul.removeChild(ul.lastChild);
}

//  REMOVES ALL OPEN CARDS FROM THE ARRAY FROM PREVIOUS GAME
openCardsArray = [];

// RESET TIMER FUNCTION
  // hasGameStartedYet = false; I THINK I DONT NEED THIS AGAIN SINCE I ADDED IT TO TIMER FUNCTION
  hasPlayerWon = true;
  shouldTimerStop = true;
  varTimer.textContent = "00 : 00";
  varSeconds = 0;
  varMinutes = 0;
  numOfSeconds = 0;

  console.log(hasGameStartedYet);

  // RESET STAR RATING
  starRating = 0;
  for(i=0; i<3; i++) {
    starsArray[i].classList.remove("hide-star");
  }


//  SET CLICK COUNTER TO 0
document.getElementById("num-of-moves").textContent = 0;
clickCounter = 0;

//  VARIABLE TO HOLD SHUFFLED ARRAY
let newShuffledArray = shuffle(deck);

//  TO ADD THE SHUFFLED ARRAY ELEMENTS BACK TO THE PAGE
for (let i = 0; i < newShuffledArray.length; i++) {
  newShuffledArray[i].classList.remove("match", "show");
  ul.appendChild(newShuffledArray[i]);
}

// TO SET MATCHING CARDS ARRAY LENGTH TO 0
matchingCardsArray.length = 0;

}

// MAKE THE SHUFFLE FUNCTION RUN ON EACH REFRESH OR PAGE LOAD

// RESTART & SHUFFLE PART ALL WORKING!
container.addEventListener("click", shuffleFunc);

function shuffleFunc(e) {
  //  REMOVE ANIMATE ROTATE 360deg
  document.querySelector(".restart").classList.remove("rotate");

  if (e.target.parentElement.classList.contains("restart")) {
    
    resetGame();

  }

}
