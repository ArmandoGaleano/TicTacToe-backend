const db = require('./FirebaseDB');

var canAddPoint = true;

const setCanAddPoint = (status) => {
    canAddPoint = status;
}

const addPoint = (winner, gameID) => {
    console.log("addPoint? "+canAddPoint)
    if (canAddPoint) {
        canAddPoint = false;

        if (winner === "X") {
            
            const ref = db.ref(`game/${gameID}/player1/points`);
            ref.once('value', snapshot => {
                const newPoint = snapshot.val() + 1;
                const ref2 = db.ref(`game/${gameID}/player1`);
                ref2.update({
                    points:newPoint
                })
            })
            

        }
        if (winner === "O") {
            
            const ref = db.ref(`game/${gameID}/player2/points`);
            ref.once('value', snapshot => {
                const newPoint = snapshot.val() + 1;
                const ref2 = db.ref(`game/${gameID}/player2`);
                ref2.update({
                    points:newPoint
                })
            })
            

        }

    }

}
module.exports = {
    setCanAddPoint,
    addPoint
}