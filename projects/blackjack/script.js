const cards = [generateCard()];
const opDeck = [generateCard()];
let gameState = 1;

window.onload = () => {
    init();
    initDealer();
}

document.querySelector('#hit').addEventListener('click', e => {
    e.preventDefault();
    if(gameState !== 1) return;
    hit(cards);
    init();
    while(opDeck.map(c => getCardValue(c)).reduce((a, v) => a + v) < 16) hit(opDeck);
})

document.querySelector('#stand').addEventListener('click', e => {
    e.preventDefault();
    hit(cards);
    init();
    const target = document.querySelector('.title-content');
    const h1 = document.createElement('h1');
    h1.innerText = !checkWinCondition() ? "You lose!" : "You win!";
    target.appendChild(h1);
    gameState = 0;

    const target2 = document.querySelector('.content');
    target2.innerHTML = target2.innerHTML + '\n' + '<button type="button" id="new" onclick="location.reload()" class="btn btn-primary" class="functional">New Game</button>';

    initDealer();
})

function initDealer() {
    const target3 = document.querySelector('.dealer');
    target3.innerHTML = '';
    const h5 = document.createElement('h5');
    h5.innerText = `Dealer's Value - ${opDeck.map(c => getCardValue(c)).reduce((a, v) => a + v)}`;
    target3.appendChild(h5);
}

function init() {
    const table = document.querySelector('tr');
    table.innerHTML = '';
    for(let i = 0; i < cards.length; i++) {
        const th = document.createElement('th');
        const card = document.createElement('img');
        card.src = `https://deckofcardsapi.com/static/img/${cards[i]}.png`;
        th.scope = 'col';
        th.appendChild(card);
        th.classList.add('card');
        table.appendChild(th);
    }
}

function checkWinCondition() {
    const total = cards.map(c => getCardValue(c)).reduce((a, v) => a + v);
    const total2 = opDeck.map(c => getCardValue(c)).reduce((a, v) => a + v);
    if(total > 21) return false;
    if(21-total > 21-total2 && total2 <= 21) return false;
    return true;
}

function generateCard() {
    const prefix = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'J', 'Q', 'K'];
    const suffix = ['D', 'S', 'C', 'H'];
    return `${prefix[Math.floor(Math.random()*prefix.length)]}${suffix[Math.floor(Math.random()*suffix.length)]}`;
}

function getCardValue(card) {
    const target = card.split('')[0];
    return isNaN(target) ? (['J', 'Q', 'K'].includes(target) ? 10 : 1) : Number(target.replace('0', '10'));
}

function hit(deck) {
    deck.push(generateCard());
    return deck;
}
