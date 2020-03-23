const db = require('./FirebaseDB');
const updateMove = require('./updateMove');
const points = require('./updatePoints');

class Game {
    constructor(socket) {
        this.socket = socket
        this.haveAWinner = {};
    }
    getGame(gameID) {
        const ref = db.ref(`game/${gameID}`);

        return new Promise((resolve, reject) => {
            ref.once('value', snapshot => {
                resolve(snapshot.val());
            })
        })
    }
    updateGame(gameID, data) {
        const ref = db.ref(`game/${gameID}`);

        ref.update({
            data
        });
    }
    resetGame(gameID) {
        const ref = db.ref(`game/${gameID}`);
        ref.update({
            game: {
                0: "",
                1: "",
                2: "",
                3: "",
                4: "",
                5: "",
                6: "",
                7: "",
                8: "",
            }
        })
    }
    checkWinner(game, gameID) {
        const toWin = [
            [0, 1, 2],
            [0, 4, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [2, 4, 6],
            [3, 4, 5],
            [6, 7, 8]
        ];
        for (let i = 0; i < toWin.length; i++) {
            if ((game[toWin[i][0]]) === "X" && (game[toWin[i][1]]) === "X" && (game[toWin[i][2]]) === "X") {
                this.haveAWinner = { winner: "X" };
                this.socket.emit('winner', "O jogador X venceu!")
            } else if ((game[toWin[i][0]]) === "O" && (game[toWin[i][1]]) === "O" && (game[toWin[i][2]]) === "O") {
                this.haveAWinner = { winner: "O" };
                this.socket.emit('winner', "O jogador O venceu!");
            }
        }
        if(this.haveAWinner.winner){
            
            points.addPoint(this.haveAWinner.winner, gameID);
            this.haveAWinner = {};
        }
        
        if (!this.haveAWinner.winner &&
            game[0].length &&
            game[1].length &&
            game[2].length &&
            game[3].length &&
            game[4].length &&
            game[5].length &&
            game[6].length &&
            game[7].length &&
            game[8].length
        ) {
            this.socket.emit('winner', "Empate");
        }
    }


    handleTurn(gameID) {
        const ref = db.ref(`game/${gameID}`);
        ref.once('value', snapshot => {
            const playerTurn = snapshot.val().playerTurn;
            if (playerTurn === "player1") {
                ref.update({
                    playerTurn: "player2"
                });
            }
            else if (playerTurn === "player2") {
                ref.update({
                    playerTurn: "player1"
                });
            }
        })


    }
    addAMove(gameID, player, move) {

        this.getGame(gameID)
            .then(res => {
                const gamePlays = res.game;
                const currentPlayerTurn = res.playerTurn;
                if (player === currentPlayerTurn) {
                    if ((gamePlays[move]).length === 0) {
                        updateMove(move, currentPlayerTurn, gameID);
                        this.handleTurn(gameID);
                    } else {
                        //Enviar erro na jogada
                    }
                }

            })
    }

    listenGame(gameID) {
        const ref = db.ref(`game/${gameID}`);
        ref.on('value', snapshot => {
            this.socket.emit('gameData', snapshot.val());
        })
        const ref2 = db.ref(`game/${gameID}/game`);
        ref2.on('value', snapshot => {
            this.socket.emit('gameMoves', snapshot.val());
            this.checkWinner(snapshot.val(), gameID);
        })
    }
    verifyID(gameID) {
        return new Promise((resolve, reject) => {
            const ref = db.ref(`game/${gameID}`);
            ref.once('value', snapshot => {

                if (snapshot.val() === null) {
                    resolve(false)

                } else {
                    resolve(true)
                }
            })
        })
    }
    joinGame(gameID) {
        if (gameID.length) {
            this.verifyID(gameID)
                .then(gameFound => {
                    if (gameFound) {
                        const res = db.ref(`game/${gameID}`);
                        const playerRef = res.child('player2');
                        playerRef.update({
                            online: true
                        });
                        this.socket.emit('joinGameStatus', true);
                    } else {
                        this.socket.emit('joinGameStatus', false);
                    }
                })
        }
        else {
            this.socket.emit('joinGameStatus', false);
        }
    }
    createGame() {

        const res = db.ref('game');
        const newGame = res.push({

            game: {
                0: "",
                1: "",
                2: "",
                3: "",
                4: "",
                5: "",
                6: "",
                7: "",
                8: "",
            },
            playerTurn: "player1",
            player1: {
                online: true,
                points: 0
            },
            player2: {
                online: false,
                points: 0
            }
        });

        this.socket.emit("newGameID", newGame.key)
    }

}

module.exports = Game;