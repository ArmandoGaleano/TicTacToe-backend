const express = require('express');
const path = require('path');
const db = require('./modules/FirebaseDB');
const Game = require('./modules/Game');
const points = require('./modules/updatePoints');
const cors = require('cors');
const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(cors())
app.use(express.static(path.join(__dirname, 'client/public')));
app.set('views', path.join(__dirname, 'client/public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html'); 

app.use((res, res) => {
    res.setHeader('Access-Control-Allow-Origin', "*")
})
io.on('connection', socket => {
    const objGame = new Game(socket);
    //Create a new Game, only player 1 can create
    socket.on('createGame', () => {
        objGame.createGame();
    })
    //Player 2 join in game with gameID
    socket.on('joinGame',  gameID  => {
        console.log("joinGame")
        objGame.joinGame(gameID);
    })
    //Listen any changes in game
    socket.on('listenGame', gameID => {
        objGame.listenGame(gameID);
    })
    socket.on('handlePlayerTurn', data => {
        const { gameID, player, move } = data;
        objGame.addAMove(gameID, player, move);
    })
    socket.on('resetGame', gameID => {
        objGame.resetGame(gameID);
        points.setCanAddPoint(true);
    })
})

server.listen(process.env.PORT || 3000)