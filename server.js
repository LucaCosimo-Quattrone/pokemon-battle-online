// Require external modules
const express   = require('express');
const http      = require('http');
const socketio  = require('socket.io');
const { connected } = require('process');

// Require internal modules
const joinUser          = require('./users.js').joinUser;
const deleteUser        = require('./users.js').deleteUser;
const getUserById       = require('./users.js').getUserById;
const getUsersByRoom    = require('./users.js').getUsersByRoom;


const app       = express();
const server    = http.createServer(app);
const io        = socketio(server);

var rooms = 0;
var connectedUsers = 0;
var usersArray = [];

const PORT      = process.env.PORT || 8080;
const listener  = server.listen(PORT, () =>
    console.log(`The server is listening on port: ${listener.address().port}`)
);

// Define static directory public_html
app.use(express.static(`${__dirname}/public_html`));

io.on('connection', socket => {

    // endpoint used when a new user makes a connection
    // to the webserver
    socket.on('join', ({nickname}) => {
        console.log("[+] --> "+nickname+" joins game.");
        usersArray.push(nickname);
        
        // check how many users are connected to verify
        // if there is a room with one player that is
        // waiting or if a new room has to bed created
        if(connectedUsers % 2 != 0)
        {
            // there is a player in one room that is waiting
            // for his opponent. The player who just makes a 
            // connection will be his opponent, so he will
            // join his room and starts the game
            var currentRoom = 'room'+rooms; 
            var user = joinUser(socket.id, nickname, currentRoom);
            socket.join(currentRoom);
            console.log("   [*] --> "+nickname+' join '+currentRoom);
            if(io.nsps['/'].adapter.rooms[currentRoom].length != 2)
            {
                // alone in the room, waiting for opponent
                var informationMessage = "Waiting to find your opponent..";
                socket.emit('information', informationMessage);
            }else{
                // opponent arrives, now the game can start

                // send startGame signal to the player
                var opponent = usersArray[(usersArray.length-2)]
                var message = "Game started! Your opponent is "+opponent;
                var startSignal = {message: message, tplayer: 2, nickname: nickname, opponent: opponent};
                socket.emit('startGame', startSignal);

                // send startGame signal to the opponent
                message = "Game started! Your opponent is "+nickname;
                startSignal = {message: message, tplayer: 1, nickname: opponent, opponent: nickname};
                socket.broadcast.to(currentRoom).emit('startGame', startSignal);

                rooms++;
            }

        }else{
            // new room has to be created because there
            // aren't connected users yet or there is an
            // even number of users connected
            // rooms++;
            var currentRoom = 'room'+rooms;
            var user = joinUser(socket.id, nickname, currentRoom);
            socket.join(currentRoom);
            console.log("   [*] --> "+nickname+' join '+currentRoom);
            if(io.nsps['/'].adapter.rooms[currentRoom].length != 2)
            {
                // alone in the room, waiting for opponent
                var informationMessage = "Waiting to find your opponent..";
                socket.emit('information', informationMessage);
            }else{
                // opponent arrives, now the game can start

                // send startGame signal to the player
                var opponent = usersArray[(usersArray.length-2)]
                var message = "Game started! Your opponent is "+opponent;
                var startSignal = {message: message, tplayer: 2, nickname: nickname, opponent: opponent};
                socket.emit('startGame', startSignal);
                
                // send startGame signal to the opponent
                message = "Game started! Your opponent is "+nickname;
                startSignal = {message: message, tplayer: 1, nickname: opponent, opponent: nickname};
                socket.broadcast.to(currentRoom).emit('startGame', startSignal);
            }
        }
        connectedUsers++;
    });

    // endpoint used when one player makes a move
    // notify to the other player of the room which
    // cell has to be updated
    socket.on('moveDone', (move) => {
        var user = getUserById(socket.id);
        socket.broadcast.to(user.room).emit('updateTris', move.cell);
    });

    // endpoint used when the player who made
    // last move win the game or the game ended
    // in a draw
    socket.on('result', (result) => { 
        if(result.result == 0)
        {
            // draw
            socket.emit('showResult', "Game ended with draw!");
            var user = getUserById(socket.id);
            socket.broadcast.to(user.room).emit('showResult', "Game ended with draw!");
        }else
        {
            // player 1 or player 2 win
            socket.emit('showResult', result.nickname+", you win!");
            var user = getUserById(socket.id);
            socket.broadcast.to(user.room).emit('showResult', "Game ended. "+result.nickname+" wins!");
        }
    });

    // endpoint used when the game ended,
    // so the player won't be connected
    // anymore
    socket.on('disconnect',() => {
        // delete user from the array of connected users
        var user = getUserById(socket.id); 
        deleteUser(socket.id);
        console.log("[-] --> "+user.nickname+" leaves the game.");

        // disconnect also the other player of
        // the room if he's connected
        var room = user.room;
        var opponentToDelete = getUsersByRoom(room);

        if(opponentToDelete != undefined)
        {
            // notify the player that his opponent leave the game
            var informationMessage = user.nickname + " left the game.";
            socket.broadcast.to(opponentToDelete.room).emit('showResult', informationMessage);
        }
        connectedUsers--;
    });
});

/*

       0  |  1  |  2
     _____|_____|_____
       3  |  4  |  5
     _____|_____|_____    
       6  |  7  |  8
          |     |

*/
