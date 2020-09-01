const gameModule = (() => {

    'use strict';

    let deck = [];
    const types = ['C', 'H', 'D', 'S'],
        specials = ['A', 'J', 'Q', 'K'];

    let playerPoints = [];
    let pc;

    // HTML Ref
    const btnHit = document.querySelector('#btnHit'),
        btnStand = document.querySelector('#btnStand'),
        btnNew = document.querySelector('#btnNew'),

        cardsContainer = document.querySelectorAll('.cards-container'),
        pointsHTML = document.querySelectorAll('.points');
    btnStand.disabled = true;



    const initGame = (players = 2) => {
        playerPoints = [];
        for (let i = 0; i < players; i++) {
            playerPoints.push(0);
            pointsHTML[i].innerText = 0;
            cardsContainer[i].innerHTML = '';
        }

        pc = playerPoints.length - 1;

        deck = createDeck();
        btnHit.disabled = false;
        btnStand.disabled = true;
        btnNew.disabled = false;
    };



    // Create a new Deck
    const createDeck = () => {
        deck = [];
        for (let i = 2; i <= 10; i++) {
            for (const type of types) {
                deck.push(i + type);
            }
        }

        for (const special of specials) {
            for (const type of types) {
                deck.push(special + type);
            }
        }

        return _.shuffle(deck);
    };

    // Take a card
    const hit = () => {
        if (deck.length === 0) {
            throw 'No more cards in deck';
        }
        return deck.pop();
    };

    const getValue = (card) => {
        const value = card.substring(0, card.length - 1);
        return isNaN(value) ? (value === 'A' ? 11 : 10) : value * 1;
    };

    const newGame = () => {
        initGame();
    };


    const takeCard = (turn) => {
        const card = hit();
        playerPoints[turn] += getValue(card);
        pointsHTML[turn].innerText = playerPoints[turn];
        const cardImg = document.createElement('img');
        cardImg.classList.add('bj-card');
        cardImg.src = `assets/cards/${card}.png`;

        cardsContainer[turn].append(cardImg);
    };

    // Computer's turn
    const pcGame = (minPoints) => {
        let points = playerPoints[pc];
        do {
            takeCard(pc);
            points = playerPoints[pc];

        } while (minPoints > points);

        setTimeout(() => {
            if (points === minPoints) {
                Swal.fire({
                    icon: 'warning',
                    title: 'It is a tie',
                    text: 'No one wins'
                });
            } else if (points > minPoints && points <= 21) {
                Swal.fire({
                    icon: 'error',
                    title: 'GAME OVER',
                    text: 'PC Wons!'
                }).then((result) => {
                    if (result.value) {
                        newGame();
                    }
                });
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'Congratulations!!',
                    text: 'You won'
                }).then((result) => {
                    if (result.value) {
                        newGame();
                    }
                });
            }
        });

    };

    //Events
    btnHit.addEventListener('click', () => {

        const turn = 0;
        takeCard(turn);
        btnStand.disabled = false;

        if (playerPoints[turn] > 21) {
            Swal.fire({
                icon: 'error',
                title: 'GAME OVER',
                timer: 1500
            }).then((result) => {
                if (result.value) {
                    newGame();
                }
            });
            btnHit.disabled = true;
            btnStand.disabled = true;
        } else if (playerPoints[turn] === 21) {
            Swal.fire({
                icon: 'success',
                title: '21, Great!!',
                text: 'Computer`s turn',
                showConfirmButton: false,
                timer: 500
            }).then((result) => {
                btnHit.disabled = true;
                btnStand.disabled = true;
                btnNew.disabled = true;
                pcGame(playerPoints[turn]);

            });

        }
    });

    btnNew.addEventListener('click', () => {
        const turn = 0;
        if (playerPoints[turn] < 21 || (playerPoints[turn] === 21 && playerPoints[pc] === 0)) {
            Swal.fire({
                title: 'Are you sure you want to start a new game?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes'
            }).then((result) => {
                if (result.value) {
                    newGame();
                }
            });
        } else {
            newGame();
        }
    });

    btnStand.addEventListener('click', () => {
        btnStand.disabled = true;
        btnNew.disabled = true;
        btnHit.disabled = true;
        pcGame(playerPoints[0]);
    });

    return {
        newGame: initGame
    }
})()