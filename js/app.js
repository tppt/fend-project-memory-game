/*
 * Create a list that holds all of your cards
 */
let cards = Array.from(document.querySelectorAll('.card'));
let openCards = [];

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

//Shuffle deck when we click the restart button.
document.querySelector('.restart').addEventListener('click', function (event) {
    shuffleCards();
});

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

    showCard(card);
    queueCard(card);

    if (openCards.length === 2) {
        checkCards();
        clearQueue();
    }
});

function checkCards () {
    const card1 = openCards[0];
    const card2 = openCards[1];
    
    if (card1.innerHTML === card2.innerHTML) {
        //Match
        lockCard(card1);
        lockCard(card2);
    }
    else {
        //No Match
        hideCard(card1);
        hideCard(card2);
    }
}

function clearQueue () {
    openCards = [];
}

function hideCard (card) {
    card.classList.remove('open', 'show');
}

function lockCard (card) {
    hideCard(card);
    card.classList.add('match');
}

function queueCard (card) {
    openCards.push(card);
}

function showCard (card) {
    card.classList.add('open', 'show');
}