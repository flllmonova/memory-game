'use strict';

const invertedCards = [];

const modal = createModal();
const leaderBoard = createLeaderBoard();

let isGameBoardLocked = false;
let movesCount = 0;
let foundPairs = 8;

initLayout();

async function initLayout() {
  try {

    const response = await fetch('./game-data.json');
    if (!response.ok) throw Error('Failed to load JSON');

    const result = await response.json();
    const cardsData = result['cards'];
    const gameSettings = result['settings'];
  
    const body = document.body;

    body.appendChild(modal);
    body.appendChild(leaderBoard);

    const pageWrapper = createPageWrapper();
    body.insertBefore(pageWrapper, body.firstChild);

    const header = createHeader();
    const main = createStatsAndGameBoard();
    const footer = createFooter();

    [header, main, footer].forEach((el) => pageWrapper.appendChild(el));

    initGame(cardsData);

    const newGameButton = header.querySelector('.new-game-button');
    newGameButton.addEventListener('click', ()=> initGame(cardsData));

    const modalNewGameButton = modal.querySelector('.modal-new-game-button');
    modalNewGameButton.addEventListener('click', () => {
      closeModal();
      initGame(cardsData);
    })

  } catch(error) {
    console.log('Failed to init game', error);
  }
}

function initGame(cardsData) {

  initStatics();

  const deck = [...makeCards(cardsData), ...makeCards(cardsData)];
  shuffleDeck(deck);

  const gameBoard = document.getElementById('game-board');

  while(gameBoard.firstChild) gameBoard.removeChild(gameBoard.firstChild);
  
  deck.forEach((card) => gameBoard.appendChild(card));
}

function createHeader() {
  const header = document.createElement('header');
  header.classList.add('header');

  const headerButtons = createHeaderButtons();
  headerButtons.forEach((button) => header.appendChild(button));

  return header;
}

function createFooter() {
  const footer = document.createElement('footer');
  footer.classList.add('footer');

  const photoStock = document.createElement('p');
  photoStock.classList.add('photo-stock');

  const photoStockText = document.createElement('span');
  photoStockText.textContent = "Photo Stock: ";

  const photoStockLink = document.createElement('a');
  photoStockLink.setAttribute('href', 'https://unsplash.com/');
  photoStockLink.setAttribute('target', '_blank');
  photoStockLink.setAttribute('rel', 'noreferrer noopener');
  photoStockLink.textContent = 'unsplash';

  [photoStockText, photoStockLink].forEach((el) => photoStock.appendChild(el));

  footer.appendChild(photoStock);

  return footer;
}

function createGameStats() {
  const stats = document.createElement('div');
  stats.classList.add('stats');

  const movesCountEl = createMovesCountEl();
  const pairsFoundEl = createPairsFoundEl();

  [movesCountEl, pairsFoundEl].forEach((el) => stats.appendChild(el));

  return stats;
}

function createPairsFoundEl() {
  const pairsFoundEl = document.createElement('p');
  pairsFoundEl.classList.add('pairs-found');

  const pairsFoundText = document.createElement('span');
  pairsFoundText.textContent = 'Pairs found: ';
  pairsFoundEl.appendChild(pairsFoundText);

  const pairsFoundValue = document.createElement('span');
  pairsFoundValue.textContent = '0 / 8';
  pairsFoundEl.appendChild(pairsFoundValue);

  return pairsFoundEl;
}

function createMovesCountEl() {
  const movesCountEl = document.createElement('p');
  movesCountEl.classList.add('moves-count');
  
  const movesCountText = document.createElement('span');
  movesCountText.textContent = 'Moves count: ';
  movesCountEl.appendChild(movesCountText);

  const movesCountValue = document.createElement('span');
  movesCountValue.textContent = '0';
  movesCountEl.appendChild(movesCountValue);

  return movesCountEl;
}

function createHeaderButtons() {
  const newGameButton = document.createElement('button');
  newGameButton.classList.add('new-game-button', 'button');
  newGameButton.type = "button";
  newGameButton.textContent = 'New game';

  const leaderboardButton = document.createElement('button');
  leaderboardButton.classList.add('leaderboard-button', 'button');
  leaderboardButton.type = "button";
  leaderboardButton.textContent = 'Leaderboard';
  leaderboardButton.addEventListener('click', () => showLeaderBoard());

  return [newGameButton, leaderboardButton];
}

function createGameBoard() {
  const gameBoard = document.createElement('div');
  gameBoard.setAttribute('id', 'game-board');
  gameBoard.classList.add('game-board');

  return gameBoard;
}

function createStatsAndGameBoard() {
  const main = document.createElement('main');
  main.classList.add('main');

  const title = document.createElement('h1');
  title.classList.add('title');
  title.textContent = 'Memo game';
  
  const stats = createGameStats();
  const gameBoard = createGameBoard();

  [title, stats, gameBoard].forEach((el) => main.appendChild(el));

  return main;
}

function createPageWrapper() {
  const pageWrapper = document.createElement('div');
  pageWrapper.classList.add('page-wrapper');
  return pageWrapper;
}

function createModal() {
  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.setAttribute('aria-modal', 'true');

  const modalOverlay = document.createElement('div');
  modalOverlay.classList.add('modal-overlay');

  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');

  [modalOverlay, modalContent].forEach((el) => modal.appendChild(el));

  const modalTitle = document.createElement('h2');
  modalTitle.classList.add('modal-title');
  modalTitle.textContent = 'Congratulations!';

  const modalMessage = document.createElement('p');
  modalMessage.classList.add('modal-message');

  const modalButtonWrapper = document.createElement('div');
  modalButtonWrapper.classList.add('modal-button-wrapper');

  [modalTitle, modalMessage, modalButtonWrapper].forEach((el) => modalContent.appendChild(el));


  const modalNewGameButton = document.createElement('button');
  modalNewGameButton.classList.add('modal-new-game-button', 'button');
  modalNewGameButton.type = "button";
  modalNewGameButton.textContent = 'New game';
  modalContent.appendChild(modalNewGameButton);

  const modalCloseButton = document.createElement('button');
  modalCloseButton.classList.add('modal-close-button', 'button');
  modalCloseButton.type = "button";
  modalCloseButton.textContent = 'close';

  
  [modalNewGameButton, modalCloseButton].forEach((el) => modalButtonWrapper.appendChild(el));

  [modalOverlay, modalCloseButton].forEach((el) => el.addEventListener('click', closeModal));

  return modal;
}

function makeCard(cardData) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.dataset.id = cardData['id'];

  const backCard = document.createElement('div');
  backCard.classList.add('card-back');
  card.appendChild(backCard);

  const frontCard = document.createElement('div');
  frontCard.classList.add('card-front');
  card.appendChild(frontCard);

  const picture = document.createElement('picture');
  picture.classList.add('card__img-wrapper');
  
  const sourceAvif = document.createElement('source');
  sourceAvif.setAttribute('srcset', cardData['srcAvif']);
  sourceAvif.setAttribute('type', 'image/avif');
  
  const sourceWebp = document.createElement('source');
  sourceWebp.setAttribute('srcset', cardData['srcWebp']);
  sourceWebp.setAttribute('type', 'image/webp');

  const img = document.createElement('img');
  img.setAttribute('src', cardData['srcJpeg']);
  img.setAttribute('alt', cardData['alt']);
  img.classList.add('card__img');
  img.setAttribute('width', '400');
  img.setAttribute('height', '400');

  picture.appendChild(sourceAvif);
  picture.appendChild(sourceWebp);
  picture.appendChild(img);

  backCard.appendChild(picture);

  card.addEventListener('click', handleCardClick);

  return card;
}

function matchCards() {

  updateMovesCount();

  const firstCard = invertedCards[0];
  const secondCard = invertedCards[1];
  
  if (firstCard.dataset.id === secondCard.dataset.id) {
    updateFoundPairs();
    invertedCards.forEach((card) => {
      card.removeEventListener('click', handleCardClick);
    });
    invertedCards.splice(0);
  } else {
    setTimeout(() => {
      firstCard.classList.remove('visible');
      secondCard.classList.remove('visible');
      invertedCards.splice(0);
    }, 750);
  }
}

function makeCards(cardsData) {
  const cards = [];

  cardsData.forEach((cardData) => {
    const card = makeCard(cardData);
    cards.push(card);  
  })

  return cards;
}

function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function handleCardClick(event) {
  event.preventDefault();
  if (invertedCards.length === 2) return;

  if (invertedCards.length <= 1) {
    const card = event.currentTarget;
    card.classList.add('visible');
    if (!invertedCards.includes(card)) {
      invertedCards.push(card);
    }

    if (invertedCards.length == 2) {
      matchCards();
    }
  }
}

function updateMovesCount() {
  movesCount++;
  const movesCountElem = document.querySelector('.moves-count span:last-child');
  if (movesCountElem) movesCountElem.textContent = `${movesCount}`;
}



function updateFoundPairs() {
  foundPairs++;

  const maxFoundPairs = 8;

  const foundPairsElem = document.querySelector('.pairs-found span:last-child');
  if (foundPairsElem) foundPairsElem.textContent = `${foundPairs} / ${maxFoundPairs}`;
   
  if (foundPairs === maxFoundPairs) {
    const modalMessage = modal.querySelector('.modal-message');
    modalMessage.textContent = `You successfully completed the game in ${movesCount} moves.`;
    setTimeout(() => {
      showModal();
    }, 300);
    fixResult();
  }
}

function resetVisibilityCards() {
  const visibleCards = document.querySelectorAll('.card.visible');
  visibleCards.forEach((card) => {
    card.classList.remove('visible');
  });
}
  
function initStatics() {
  movesCount = 0;
  foundPairs = 0;

  const movesCountValue = document.querySelector('.moves-count span:last-child');
  if (movesCountValue) movesCountValue.textContent = '0';

  const pairsFoundValue = document.querySelector('.pairs-found span:last-child');
  if (pairsFoundValue) pairsFoundValue.textContent = '0 / 8';
}

function showLeaderBoard() {
  leaderBoard?.classList?.add('is-visible');
  displayResults();
  lockScreen();
}

function closeLeaderBoard() {
  leaderBoard?.classList?.remove('is-visible');
  unlockScreen();
}

function showModal() {
  modal?.classList?.add('is-visible');
  lockScreen();
}

function closeModal() {
  modal?.classList?.remove('is-visible');
  unlockScreen();
}

function lockScreen() {
  const screen = document.querySelector('body');
  if (screen) {
    screen.style.overflowY = 'hidden';
  }
}

function unlockScreen() {
  const screen = document.querySelector('body');
  if (screen) {
    screen.style.overflowY = 'scroll';
  }
}

window.addEventListener('keydown', (event) => {
  const key = event.key;
  const isKeyEscape = key === 'Escape';

  if (modal) {
    const isModalVisible = modal.classList.contains('is-visible');
    if (isModalVisible && isKeyEscape) {
      closeModal();
    }
  }

  if (leaderBoard) {
    const isLeaderBoardVisible = leaderBoard.classList.contains('is-visible');
    if (isLeaderBoardVisible && isKeyEscape) {
      closeLeaderBoard();
    }
  }
});

function fixResult() {
  const date = new Date();
  
  const result = {
    "timeInMs": date.getTime(),
    "formattedDate": date.toLocaleDateString('ru-Ru'),
    "moves": movesCount,
  };

  const stored = localStorage.getItem('results');
  const results = stored ? JSON.parse(stored) : [];

  results.push(result)

  localStorage.setItem('results', JSON.stringify(results));
}

function createLeaderBoard() {
  const leaderBoardModal = document.createElement('div');
  leaderBoardModal.classList.add('leader-board-modal');

  const leaderBoardOverlay = document.createElement('div');
  leaderBoardOverlay.classList.add('leader-board-overlay');

  const leaderBoardContent = document.createElement('div');
  leaderBoardContent.classList.add('leader-board-content');
  
  [leaderBoardOverlay, leaderBoardContent].forEach((el) => leaderBoardModal.appendChild(el));
  
  const leaderBoardTitle = document.createElement('h2');
  leaderBoardTitle.classList.add('leader-board__title');
  leaderBoardTitle.textContent = 'Leader Board table'
  
  const leaderBoardMessage = document.createElement('p');
  leaderBoardMessage.classList.add('leader-board__message');

  const leaderBoardTable = document.createElement('table');

  const leaderBoardCloseButton = document.createElement('button');
  leaderBoardCloseButton.classList.add('button', 'leader-board-close-button');
  leaderBoardCloseButton.textContent = 'Close';
  
  [
    leaderBoardTitle, 
    leaderBoardMessage, 
    leaderBoardTable,
    leaderBoardCloseButton,
  ].forEach((el) => leaderBoardContent.appendChild(el));

  [
    leaderBoardOverlay,
    leaderBoardCloseButton,
  ].forEach((el) => el.addEventListener('click', () => closeLeaderBoard()));

  return leaderBoardModal;
}

function displayResults() {
  const results = localStorage.getItem('results');
  const leaderBoardMessage = document.querySelector('.leader-board__message');

  if (!results) {
    if (leaderBoardMessage) {
      leaderBoardMessage.textContent = 'No results yet.';
    }
  } else {
    const parsedResults = JSON.parse(results);
    leaderBoardMessage.textContent = '';
    makeLeaderBoardTable(parsedResults);
  }
}

function makeLeaderBoardTable(resultsData) {
  const leaderBoardTable = leaderBoard.querySelector('table');

  while(leaderBoardTable.firstChild) leaderBoardTable.removeChild(leaderBoardTable.firstChild);

  const thead = document.createElement('thead');
  
  const thRow = document.createElement('tr');
  const thPlace = document.createElement('th');
  thPlace.textContent = 'Place';
  const thMoves = document.createElement('th');
  thMoves.textContent = 'Moves';
  const thPlayer = document.createElement('th');
  thPlayer.textContent = 'Date';

  [thPlace, thMoves, thPlayer].forEach((th) => thRow.appendChild(th));
  thead.appendChild(thRow);

  const tbody = document.createElement('tbody');

  [thead, tbody].forEach((el) => leaderBoardTable.appendChild(el));

  const sortedResults = resultsData.sort((a, b) => {
    if (a.moves === b.moves) {
      return a.timeInMs - b.timeInMs;
    }
    return a.moves - b.moves;
  });

  sortedResults.slice(0, 10).forEach((result, index) => {
    const playerResult = {
      place: index + 1,
      moves: result.moves,
      formattedDate: result.formattedDate,
    };
    const playerRow = addPlayer(playerResult);
    tbody.appendChild(playerRow);
  });
}

function addPlayer(playerResult) {
  const tRow = document.createElement('tr');
  const tdPlace = document.createElement('td');
  tdPlace.textContent = playerResult.place;
  const tdMoves = document.createElement('td');
  tdMoves.textContent = playerResult.moves;
  const tdDate = document.createElement('td');
  tdDate.textContent = playerResult.formattedDate;
  
  [tdPlace, tdMoves, tdDate].forEach((td) => tRow.appendChild(td));

  return tRow;
}