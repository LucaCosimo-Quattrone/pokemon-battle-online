const socket = io();

const urlParams = new URLSearchParams(window.location.search);
const nickname = urlParams.get('nickname');
const pokemon = urlParams.get('pokemon');

class Pokemon {
    constructor(name, sprite, hp, moves) {
        this.name = name;
        this.sprite = sprite;
        this.hp = hp;
        this.fullhp = hp;
        this.moves = moves;
    }
}

var pkmList = [
    ['Charizard', 'https://img.pokemondb.net/sprites/black-white/anim/back-normal/charizard.gif', 'https://img.pokemondb.net/sprites/black-white/anim/normal/charizard.gif', 360, [
        ['Flamethrower', 'fire', 95, 0.95],
        ['Dragon Claw', 'dragon', 80, 0.95],
        ['Air slash', 'fly', 75, 0.85],
        ['Slash', 'normal', 70,]
    ]],
    ['Blastoise', 'https://img.pokemondb.net/sprites/black-white/anim/back-normal/blastoise.gif', 'https://img.pokemondb.net/sprites/black-white/anim/normal/blastoise.gif', 362, [
        ['Surf', 'water', 90, 0.95],
        ['Crunch', 'normal', 80, 0.95],
        ['Ice punch', 'ice', 75, 0.95],
        ['Flash cannon', 'steel', 80, 0.95]
    ]],
    ['Venusaur', 'https://img.pokemondb.net/sprites/black-white/anim/back-normal/venusaur-f.gif', 'https://img.pokemondb.net/sprites/black-white/anim/normal/venusaur-f.gif', 364, [
        ['Petal Blizzard', 'grass', 90, 0.95],
        ['Sludge bomb', 'poison', 90, 0.95],
        ['Earthquake', 'ground', 100, 0.95],
        ['Body Slam', 'normal', 85, 0.95]
    ]]
];

var typeMatch = {
    'Charizard': [
        ['ground'], // 0 no effect (0x dmg)
        ['water', 'rock'], // 1 weak (2x dmg)
        ['fire', 'grass', 'steel'] // 2 strong (0.5x dmg)
    ],
    'Blastoise': [
        [''],
        ['grass'],
        ['fire', 'water']
    ],
    'Venusaur': [
        ['poison'],
        ['fire', 'fly', 'ice', 'steel'],
        ['grass', 'water']
    ],
}

var i,
    j,
    turn,
    game_started,
    player,
    playerNickname,
    playerPokemon,
    playerHp,
    playerMove,
    opponentNickname,
    opponentPokemon,
    opponentHp;

initGame();

// Inizialize the variable for the game
function initGame()
{
	turn = 0;
	game_started = 0;
    player = 0;
}

// Used when a new user make the login with his nickname
var info = {nickname: nickname, pokemon: pokemon}
socket.emit('join', info);

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

    // Assign pokemon
    while (i = 0 < pkmList.length)
    {
        if (startSignal.pokemon == pkmList[i][0])
        {
            playerPokemon = new Pokemon(pkmList[i][0], pkmList[i][1], pkmList[i][3], pkmList[i][4]);
            for (j = 0; i < 4; i++) {
                document.getElementById('m' + i).value = pkm.moves[i][0];
            }
            s1 = document.createElement('img');
            s1.src = pk1.sprite;
            document.getElementById('pk1').appendChild(s1);
            document.getElementById('hp1').innerHTML = '<p>HP: ' + pk1.hp + '/' + pk1.fullhp + '</p>';
        }
        else if (startSignal.opponentPokemon == pkmList[i][0])
        {
            opponentPokemon = new Pokemon(pkmList[i][0], pkmList[i][2], pkmList[i][3], pkmList[i][4]);
            s2 = document.createElement('img');
            s2.src = pk2.sprite;
            document.getElementById('pk2').appendChild(s2);
            document.getElementById('hp2').innerHTML = '<p>HP: ' + pk2.hp + '/' + pk2.fullhp + '</p>';
        }
    }
    
	// Update the turn label 
	updateTurn();

});

// Used to update the hp of the opponent after an attack
socket.on('updateHp', (attack) => {

    if (player == attack.player)
    {
        playerHp = attack.opponentHp
    }
	turn++;
	updateTurn();
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

function updateTurn()
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

function makeAttack(move)
{
    if (player == 1 & turn % 2 == 0)
    {
        if (game_started == 1)
        {
            if (Math.random() < move[3])
            {
                let power = move[2] += Math.floor(Math.random() * 10);
                let receiverType = typeMatch[opponentPokemon[0]];
                let moveType = move[1];
                let scale = 1;

                for (i = 0; i < rtype.length; i++)
                {
                    if (receiverType[i].includes(moveType))
                    {
                        switch (i)
                        {
                            case 0:
                                scale = 0;
                                setTimeout(function ()
                                {
                                    document.getElementById('comment').innerHTML = '<p>It had no effect!</p>';
                                }, 1000);
                                break;
                            case 1:
                                scale = 2;
                                setTimeout(function ()
                                {
                                    document.getElementById('comment').innerHTML = '<p>It was super effective!</p>';
                                }, 1000);
                                break;
                            case 2:
                                scale = 0.5;
                                setTimeout(function ()
                                {
                                    document.getElementById('comment').innerHTML = '<p>It was not very effective!</p>';
                                }, 1000);
                                break;
                        }
                        break;
                    }
                }

                power *= scale;
                opponentHp -= Math.floor(power);

                var attack = { nickname: nickname, opponentHp: opponentHp, player: 2 }
                socket.emit('attackDone', attack);
                turn++;
                updateTurn();
            }
        } else if (player == 2 & turn % 2 != 0)
        {
            if (game_started == 1)
            {
                if (Math.random() < move[3])
                {
                    let power = move[2] += Math.floor(Math.random() * 10);
                    let rtype = typeMatch[receiver.name];
                    let mtype = move[1];
                    let scale = 1;

                    for (i = 0; i < rtype.length; i++)
                    {
                        if (rtype[i].includes(mtype))
                        {
                            switch (i)
                            {
                                case 0:
                                    scale = 0;
                                    setTimeout(function ()
                                    {
                                        document.getElementById('comment').innerHTML = '<p>It had no effect!</p>';
                                    }, 1000);
                                    break;
                                case 1:
                                    scale = 2;
                                    setTimeout(function ()
                                    {
                                        document.getElementById('comment').innerHTML = '<p>It was super effective!</p>';
                                    }, 1000);
                                    break;
                                case 2:
                                    scale = 0.5;
                                    setTimeout(function ()
                                    {
                                        document.getElementById('comment').innerHTML = '<p>It was not very effective!</p>';
                                    }, 1000);
                                    break;
                            }
                            break;
                        }
                    }
                    power *= scale;
                    opponentHp -= Math.floor(power);

                    var attack = { nickname: nickname, opponentHp: opponentHp, player: 1 }
                    socket.emit('attackDone', attack);
                    turn++;
                    updateTurn();
                }
            }

            // player 1 win
            if (checkVictoryCondition() == 1 & player == 1) {
                socket.emit('result', { nickname: nickname, result: 1 });
            }
            // player 2 win
            if (checkVictoryCondition() == 2 & player == 2) {
                socket.emit('result', { nickname: nickname, result: 2 });
            }

        }

    }
}

function checkVictoryCondition()
{
	var winner = 0;
	
    // first row
    if (opponentHp == 0)
	{
		winner = player;
    }
    if (playerHp == 0)
    {
        if (player == 1)
        {
            winner = 2;
        }
        else
        {
            winner = 2;
        }
    }

	return winner;
}
