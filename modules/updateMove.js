const db = require('./FirebaseDB');
function checkAndUpdate(move, letter, gameID) {
    const ref = db.ref(`game/${gameID}/game`);
    
    switch (move) {
        case 0:
            ref.update({
                    0: `${letter}`
            });
            break;
        case 1:
            ref.update({
                    1: letter
            });
            break;
        case 2:
            ref.update({
                    2: `${letter}`
            });
            break;
        case 3:
            ref.update({
                    3: `${letter}`
            });
            break;
        case 4:
            ref.update({
                    4: `${letter}`
            });
            break;
        case 5:
            ref.update({
                    5: `${letter}`
            });
            break;
        case 6:
            ref.update({
                    6: `${letter}`
            });
            break;
        case 7:
            ref.update({
                    7: `${letter}`
            });
            break;
        case 8:
            ref.update({
                    8: `${letter}`
            });
            break;
    }
}
function updateMove(move, currentPlayerTurn, gameID) {
    if (currentPlayerTurn === "player1") {
        const letter = "X";
        checkAndUpdate(move, letter, gameID);
    } else {
        const letter = "O";
        checkAndUpdate(move, letter, gameID);
    }
}

module.exports = updateMove;
