# Memory game

> The goal of the game is to open all the cards, remember their arrangement, and find all the matches in the fewest possible moves.


## Demo
Link to the game: !(Memory Game Demo)[https://github.com/flllmonova/memory-game]

## Game rules
1. The game starts on the first load and every time the page is reloaded. All 16 cards are shuffled and face down, the move counter is 0, and the number of found pairs is 0 out of 8. The player can start opening cards immediately.
2. One move consists of opening two different available cards.
3. If the images match, both cards remain open until the end of the game. The counter of found pairs increases by 1.
4. If the images differ, both cards remain visible for about a second and then close.
5. When all 8 pairs are found, the game is over. A modal window opens with a victory message, the total number of moves, and the “New Game” and “Close” buttons.
6. The header contains the “New Game” and “Leaderboard” buttons. “New Game” starts the game anew: the cards are shuffled and closed, and the counters are reset. “Leaderboard” opens the saved results in a modal window.

## Tech Stack
* HTML5
* CSS3
* JS 
* localStorage
* Git

## How to run locally

1. Open the terminal `Powershell / Bash`;
2. Clone the repository: `git clone https://github.com/flllmonova/memory-game.git`
3. Open file `index.html` in the browser. 