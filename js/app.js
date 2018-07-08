/*
 * Create a list that holds all of your cards
 */
let cards = Array.from(document.querySelectorAll('.card'));
let stars = Array.from(document.querySelectorAll('.star'));
let openCards = [];
let moves = 0;
let matched = 0;
let timerId;
let seconds = 0;
let minutes = 0;
let flippingIsPaused = false;

document.querySelector('.restart').addEventListener('click', function (event) {
    restartGame();
});

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
document.querySelector('.deck').addEventListener('click', function (event) {
    const card = event.target;
    //If we click on a non-card element, such as the <i> tag, ignore it.
    if (!card.classList.contains('card')) return;
    //If a card element has more classes than just "card", 
    //then it is already showing, and we can ignore it.
    if (card.classList.length > 1) return;
    //If two cards are showing already, and they dont match,
    //ignore other clicks until they flip back over.
    if (flippingIsPaused) return;

    if (!timerId) {
        startClock();
    }

    showCard(card);
    queueCard(card);

    if (openCards.length === 2) {
        pauseFlipping();
        checkCards();
        clearQueue();
        incrementMoves();
        updateStarRating();
        checkForWin();
    }
});

function checkCards () {
    const card1 = openCards[0];
    const card2 = openCards[1];
    
    if (card1.innerHTML === card2.innerHTML) {
        //Match
        lockCard(card1);
        lockCard(card2);
        incrementMatched();
        unpauseFlipping();
    }
    else {
        //No Match
        window.setTimeout(function () {
            hideCard(card1);
            hideCard(card2);
            unpauseFlipping();
        }, 1000);
    }
}

function checkForWin () {
    if (matched === 8) {
        stopClock();
        window.setTimeout(function () {
            const elapsedTime = document.querySelector('.clock').textContent;
            const starCount = document.querySelectorAll('.star').length;
            const message = `You won after ${elapsedTime}!  You had a rating of ${starCount} stars!  Play again?`;

            window.confirm(message) && restartGame();
        }, 500);
    }
}

function clearQueue () {
    openCards = [];
}

function hideCard (card) {
    card.classList.remove('open', 'show');
}

function incrementClock () {
    seconds++;
    if (seconds === 60) {
        minutes++;
        seconds = 0;
    }

    const secondStr = seconds > 9 ? seconds : '0' + seconds;
    const minuteStr = minutes > 9 ? minutes : '0' + minutes;

    document.querySelector('.clock').textContent = `${minuteStr} : ${secondStr}`;
}

function incrementMatched () {
    matched++;
}

function incrementMoves () {
    moves++;
    document.querySelector('.moves').textContent = moves;
}

function lockCard (card) {
    hideCard(card);
    card.classList.add('match');
}

function pauseFlipping () {
    flippingIsPaused = true;
}

function queueCard (card) {
    openCards.push(card);
}

function resetClock () {
    timerId = null;
    seconds = 0;
    minutes = 0;
    document.querySelector('.clock').textContent = '00 : 00';
}

function resetMatched () {
    matched = 0;
}

function resetMoves () {
    moves = -1;
    incrementMoves();
}

function restartGame () {
    clearQueue();
    shuffleCards();
    resetMoves();
    resetMatched();
    updateStarRating();
    stopClock();
    resetClock();
}

function showCard (card) {
    card.classList.add('open', 'show');
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
function shuffleCards () {
    cards = shuffle(cards);
    const deck = document.querySelector('.deck');
    deck.innerHTML = '';
    for (let i = 0; i < cards.length; i++) {
        cards[i].classList.remove('open', 'show', 'match');
        deck.appendChild(cards[i]);
    }
}

function startClock () {
    timerId = setInterval(function () {
        incrementClock();
    }, 1000);
}

function stopClock () {
    clearInterval(timerId);
}

function unpauseFlipping () {
    flippingIsPaused = false;
}

function updateStarRating () {
    let loops = 3;

    if (moves >= 17) {
        loops--;
    }
    if (moves >= 25) {
        loops--;
    }
    if (moves >= 33) {
        loops--;
    }

    const starList = document.querySelector('.stars');
    starList.innerHTML = '';

    for (let i = 0; i < loops; i++) {
        starList.appendChild(stars[i]);
    }
}

function init () {
    restartGame();
}

init();