const socket = io();

const urlParams = new URLSearchParams(window.location.search);
const nickname = urlParams.get('nickname');

var turn,
	game_started,
	player,
	playerNickname,
	opponentNickname,
	trisTable;

initGame();

// Used to inizialize the variable used to 
// manage the game. Used every time a player
// make the login to the game.
function initGame()
{
	
	turn = 0;
	game_started = 0;
	player = 0;
	trisTable = new Array();
	trisTable[0] = new Array();
	trisTable[1] = new Array();
	trisTable[2] = new Array();
	initTrisTable();
}

// Used when a new user make the login with his nickname
socket.emit('join', {nickname});

// Used when one player is alone in the room
socket.on('information', informationMessage => {
	// show and set the information label
	document.getElementById('informationLabel').textContent = informationMessage;
});

// Used when in the room there are 2 players and the
// game can start
socket.on('startGame', (startSignal) => {
	
	// Update the informationLabel with the name of the opponent
	document.getElementById('informationLabel').textContent = startSignal.message; 

	// Set the nicknameLabel value with the nickname of the player
	// and his number (player 1 will make the first move)
	document.getElementById('nicknameLabel').textContent = startSignal.nickname + " - Player "+startSignal.tplayer;

	// Set values to manage the game  
	game_started = 1;
	player = startSignal.tplayer;
	playerNickname = startSignal.nickname;
	opponentNickname = startSignal.opponent;

	// Update the turn label 
	updateTurnLabel();

});

// Used to update the tris table with the opponent last move
socket.on('updateTris', (cell) => {
	switch(cell){
		case 0:
			if(player == 1)
			{
				document.images[0].src = "./../images/o.png";
				trisTable[0][0] = "O";
			}else
			{
				document.images[0].src = "./../images/x.png";
				trisTable[0][0] = "X";
			}
			break;
		case 1:
			if(player == 1)
			{
				document.images[2].src = "./../images/o.png";
				trisTable[0][1] = "O";
			}else
			{
				document.images[2].src = "./../images/x.png";
				trisTable[0][1] = "X";
			}
			break;
		case 2:
			if(player == 1)
			{
				document.images[4].src = "./../images/o.png";
				trisTable[0][2] = "O";
			}else
			{
				document.images[4].src = "./../images/x.png";
				trisTable[0][2] = "X";
			}
			break;
		case 3:
			if(player == 1)
			{
				document.images[8].src = "./../images/o.png";
				trisTable[1][0] = "O";
			}else
			{
				document.images[8].src = "./../images/x.png";
				trisTable[1][0] = "X";
			}
			break;
		case 4:
			if(player == 1)
			{
				document.images[10].src = "./../images/o.png";
				trisTable[1][1] = "O";
			}else
			{
				document.images[10].src = "./../images/x.png";
				trisTable[1][1] = "X";
			}
			break;
		case 5:
			if(player == 1)
			{
				document.images[12].src = "./../images/o.png";
				trisTable[1][2] = "O";
			}else
			{
				document.images[12].src = "./../images/x.png";
				trisTable[1][2] = "X";
			}
			break;
		case 6:
			if(player == 1)
			{
				document.images[16].src = "./../images/o.png";
				trisTable[2][0] = "O";
			}else
			{
				document.images[16].src = "./../images/x.png";
				trisTable[2][0] = "X";
			}
			break;
		case 7:
			if(player == 1)
			{
				document.images[18].src = "./../images/o.png";
				trisTable[2][1] = "O";
			}else
			{
				document.images[18].src = "./../images/x.png";
				trisTable[2][1] = "X";
			}
			break;
		case 8:
			if(player == 1)
			{
				document.images[20].src = "./../images/o.png";
				trisTable[2][2] = "O";
			}else
			{
				document.images[20].src = "./../images/x.png";
				trisTable[2][2] = "X";
			}
			break;
		default:
			break;
		}
	turn++;
	updateTurnLabel();
});

// Used to show the result when the game is ended
socket.on('showResult', (result) => {
	// game is ended
	game_started = 0;
	document.getElementById('informationLabel').textContent = result;
	document.getElementById('turnLabel').textContent = "";

	// show the new game button
	$("#newGameButton").removeClass('invisible').addClass('visible');
});


// managing game animation (HTML)


function updateTurnLabel()
{
	if(turn % 2 == 0 & player == 1)
		document.getElementById('turnLabel').textContent = "Let's go "+ playerNickname + ", it's your turn!";
	else if(turn % 2 == 0 & player == 2)	
		document.getElementById('turnLabel').textContent = "Wait for "+ opponentNickname+"'s move!";
	else if(turn % 2 != 0 & player == 2)
		document.getElementById('turnLabel').textContent = "Let's go "+ playerNickname + ", it's your turn!";
	else if(turn % 2 != 0 & player == 1)
		document.getElementById('turnLabel').textContent = "Wait for "+ opponentNickname+"'s move!";	
}


function initTrisTable()
{
	for(var i=0; (i<3); i++)
	{
		for(var c=0; c<3; c++)
		{
			trisTable[i][c] = 'N';	
		}
	}
}


function makeMove(row, column)
{
	if(player == 1 & turn % 2 == 0)
	{
		if(game_started == 1){
			if(row==0 & column==0)
			{
				if(trisTable[0][0] == 'N')
				{
					document.images[0].src="./../images/x.png";
					trisTable[0][0] = "X";
					var move = {nickname: nickname, cell: 0};
					socket.emit('moveDone', move);
					turn++;
					updateTurnLabel();
				}
			}	
				
			if(row==0 & column==2)
			{
				if(trisTable[0][1] == 'N')
				{
					document.images[2].src="./../images/x.png";
					trisTable[0][1] = "X";
					var move = {nickname: nickname, cell: 1};
					socket.emit('moveDone', move);
					turn++;
					updateTurnLabel();
				}
			}
					
			if(row==0 & column==4)
			{
				if(trisTable[0][2] == 'N')
				{
					
					document.images[4].src="./../images/x.png";
					trisTable[0][2] = "X";
					var move = {nickname: nickname, cell: 2};
					socket.emit('moveDone', move);
					turn++;
					updateTurnLabel();
				}
			}
			
			if(row==2 & column==0)
			{
				if(trisTable[1][0] == 'N')
				{
					document.images[8].src="./../images/x.png";
					trisTable[1][0] = "X";
					var move = {nickname: nickname, cell: 3};
					socket.emit('moveDone', move);
					turn++;
					updateTurnLabel();
				}
			}
			
			if(row==2 & column==2)
			{
				if(trisTable[1][1] == 'N')
				{
					document.images[10].src="./../images/x.png";
					trisTable[1][1] = "X";
					var move = {nickname: nickname, cell: 4};
					socket.emit('moveDone', move);
					turn++;
					updateTurnLabel();
				}
			}
			
			if(row==2 & column==4)
			{	
				if(trisTable[1][2] == 'N')
				{
					document.images[12].src="./../images/x.png";
					trisTable[1][2] = "X";
					var move = {nickname: nickname, cell: 5};
					socket.emit('moveDone', move);
					turn++;
					updateTurnLabel();
				}
			}
			
			if(row==4 & column==0)
			{
				if(trisTable[2][0] == 'N')
				{	
					document.images[16].src="./../images/x.png";
					trisTable[2][0] = "X";
					var move = {nickname: nickname, cell: 6};
					socket.emit('moveDone', move);
					turn++;
					updateTurnLabel();
				}
			}
			
			if(row==4 & column==2)
			{
				if(trisTable[2][1] == 'N')
				{
					document.images[18].src="./../images/x.png";
					trisTable[2][1] = "X";
					var move = {nickname: nickname, cell: 7};
					socket.emit('moveDone', move);
					turn++;
					updateTurnLabel();
				}
			}
			
			if(row==4 & column==4)
			{
				if(trisTable[2][2] == 'N')
				{
					document.images[20].src="./../images/x.png";
					trisTable[2][2] = "X";
					var move = {nickname: nickname, cell: 8};
					socket.emit('moveDone', move);
					turn++;
					updateTurnLabel();
				}
			}
		}
	}else if(player == 2 & turn % 2 != 0)
	{
		if(game_started == 1){
			if(row==0 & column==0)
			{
				if(trisTable[0][0] == 'N')
				{
					document.images[0].src="./../images/o.png";
					trisTable[0][0] = "O";
					var move = {nickname: nickname, cell: 0};
					socket.emit('moveDone', move);
					turn++;
					updateTurnLabel();
				}
			}	
				
			if(row==0 & column==2)
			{
				if(trisTable[0][1] == 'N')
				{
					document.images[2].src="./../images/o.png";
					trisTable[0][1] = "O";
					var move = {nickname: nickname, cell: 1};
					socket.emit('moveDone', move);
					turn++;
					updateTurnLabel();
				}
			}
					
			if(row==0 & column==4)
			{
				if(trisTable[0][2] == 'N')
				{
					document.images[4].src="./../images/o.png";
					trisTable[0][2] = "O";
					var move = {nickname: nickname, cell: 2};
					socket.emit('moveDone', move);
					turn++;
					updateTurnLabel();
				}
			}
			
			if(row==2 & column==0)
			{
				if(trisTable[1][0] == 'N')
				{
					document.images[8].src="./../images/o.png";
					trisTable[1][0] = "O";
					var move = {nickname: nickname, cell: 3};
					socket.emit('moveDone', move);
					turn++;
					updateTurnLabel();
				}
			}
			
			if(row==2 & column==2)
			{
				if(trisTable[1][1] == 'N')
				{
					document.images[10].src="./../images/o.png";
					trisTable[1][1] = "O";
					var move = {nickname: nickname, cell: 4};
					socket.emit('moveDone', move);
					turn++;
					updateTurnLabel();
				}
			}
			
			if(row==2 & column==4)
			{	
				if(trisTable[1][2] == 'N')
				{
					document.images[12].src="./../images/o.png";
					trisTable[1][2] = "O";
					var move = {nickname: nickname, cell: 5};
					socket.emit('moveDone', move);
					turn++;
					updateTurnLabel();
				}
			}
			
			if(row==4 & column==0)
			{
				if(trisTable[2][0] == 'N')
				{
					document.images[16].src="./../images/o.png";
					trisTable[2][0] = "O";
					var move = {nickname: nickname, cell: 6};
					socket.emit('moveDone', move);
					turn++;
					updateTurnLabel();
				}
			}
			
			if(row==4 & column==2)
			{
				if(trisTable[2][1] == 'N')
				{
					document.images[18].src="./../images/o.png";
					trisTable[2][1] = "O";
					var move = {nickname: nickname, cell: 7};
					socket.emit('moveDone', move);
					turn++;
					updateTurnLabel();
				}
			}
			
			if(row==4 & column==4)
			{
				if(trisTable[2][2] == 'N')
				{
					document.images[20].src="./../images/o.png"
					trisTable[2][2] = "O"
					var move = {nickname: nickname, cell: 8};
					socket.emit('moveDone', move);
					turn++;
					updateTurnLabel();
				}
			}
		}	
	}

	// game ended with draw
	if(checkVictoryCondition() == 0 & turn == 9)
	{
		socket.emit('result', {nickname: nickname, result: 0});
	}
	// player 1 win
	if(checkVictoryCondition() == 1 & player == 1)
	{
		socket.emit('result', {nickname: nickname, result: 1});
	}
	// player 2 win
	if(checkVictoryCondition() == 2 & player == 2)
	{
		socket.emit('result', {nickname: nickname, result: 2});
	}
		
}

function checkVictoryCondition()
{
	var winner = 0;
	
	// first row
	if ((trisTable[0][0] == "X") & (trisTable[0][1] == "X") & (trisTable[0][2] == "X"))
	{
		winner = 1;
	}
	
	if ((trisTable[0][0] == "O") & (trisTable[0][1] == "O") & (trisTable[0][2] == "O"))
	{
		winner = 2;
	}
	
	// second row
	if ((trisTable[1][0] == "X") & (trisTable[1][1] == "X") & (trisTable[1][2] == "X"))
	{
		winner = 1;
	}
	
	if ((trisTable[1][0] == "O") & (trisTable[1][1] == "O") & (trisTable[1][2] == "O"))
	{
		winner = 2;
	}
	
	// third row
	if ((trisTable[2][0] == "X") & (trisTable[2][1] == "X") & (trisTable[2][2] == "X"))
	{
		winner = 1;
	}
	
	if ((trisTable[2][0] == "O") & (trisTable[2][1] == "O") & (trisTable[2][2] == "O"))
	{
		winner = 2;
	}
	
	// first column
	if ((trisTable[0][0] == "X") & (trisTable[1][0] == "X") & (trisTable[2][0] == "X"))
	{
		winner = 1;
	}
	
	if ((trisTable[0][0] == "O") & (trisTable[1][0] == "O") & (trisTable[2][0] == "O"))
	{
		winner = 2;
	}
	
	// second column
	if ((trisTable[0][1] == "X") & (trisTable[1][1] == "X") & (trisTable[2][1] == "X"))
	{
		winner = 1;
	}
	
	if ((trisTable[0][1] == "O") & (trisTable[1][1] == "O") & (trisTable[2][1] == "O"))
	{
		winner = 2;
	}
	
	// third column
	if ((trisTable[0][2] == "X") & (trisTable[1][2] == "X") & (trisTable[2][2] == "X"))
	{
		winner = 1;
	}
	
	if ((trisTable[0][2] == "O") & (trisTable[1][2] == "O") & (trisTable[2][2] == "O"))
	{
		winner = 2;
	}
	
	// main diagonal
	if ((trisTable[0][0] == "X") & (trisTable[1][1] == "X") & (trisTable[2][2] == "X"))
	{
		winner = 1;
	}
	
	if ((trisTable[0][0] == "O") & (trisTable[1][1] == "O") & (trisTable[2][2] == "O"))
	{
		winner = 2;
	}
	
	// secondary diagonal
	if ((trisTable[0][2] == "X") & (trisTable[1][1] == "X") & (trisTable[2][0] == "X"))
	{
		winner = 1;
	}
	
	if ((trisTable[0][2] == "O") & (trisTable[1][1] == "O") & (trisTable[2][0] == "O"))
	{
		winner = 2;
	}
	return winner;
}

