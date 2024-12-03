const playerModels = require("../models/playerModels")
const gameModels = require("../models/gameModels");
const mongoose = require('mongoose');
// const router = express.Router()

const createGame = async (req, res)=>{
    try{
    const {playerOneName , playerTwoName , category} = req.body;

    if (!playerOneName || !playerTwoName) {
      return res.status(400).json({ message: 'Both player names are required.' });
    }

    const playerFirst = await playerModels.create({name:playerOneName});
    const playerSecond = await playerModels.create({name:playerTwoName});

    if (!playerFirst || !playerSecond) {
      return res.status(500).json({ message: 'Failed to create players.' });
    }

    const game = await gameModels.create({
        players : [
            { id:playerFirst._id, name: playerFirst.name },
            { id: playerSecond._id , name:playerSecond.name }
        ],
        category
    });
    res.json(game);

    }
    catch (error){
        res.status(500).json({message: error.message});
        // res.status(500).json({ message: 'Error creating game' });
    }
}

async function getGame(req, res){
    try{
        const gameId = req.params.gameId;
        console.log("Received gameId:", gameId);

        if (!mongoose.Types.ObjectId.isValid(gameId)) {
            return res.status(400).json({ message: "Invalid gameId" });
        }

        const game = await gameModels.findById(gameId);

        if(!game){
            return res.status(404).json({ message:"Game not found"}); 
        }
        res.json(game);
    }
    catch(error){
        res.status(500).json({ message: error.message});
    }
}

async function updateGameScore(gameId, playerId, isCorrect, difficulty) {
  if (!['easy', 'medium', 'hard'].includes(difficulty)) {
    throw new Error('Invalid difficulty level');
  }

  const game = await gameModels.findById(gameId);
  if (!game) {
    throw new Error('Game not found');
  }

  const player = game.players.find((p) => String(p.id) === playerId);
  if (!player) {
    throw new Error('Player not part of this game');
  }

  let scoreIncrement = 0;
  if (isCorrect) {
    if (difficulty === 'easy') scoreIncrement = 10;
    else if (difficulty === 'medium') scoreIncrement = 15;
    else if (difficulty === 'hard') scoreIncrement = 20;
  }

  player.score += scoreIncrement;
  await game.save();

  return {
    id: player.id,
    name: player.name,
    score: player.score,
  };
}

async function concludeGameAndAnnounceResults(req, res) {
  try {
    const { gameId } = req.params;


    const game = await gameModels.findById(gameId);

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    game.status = 'completed';
    await game.save();

    const players = game.players;

    if (!players || players.length === 0) {
      return res.json({
        message: "Game concluded successfully",
        results: "No players participated in this game",
      });
    }

    let topScore = -Infinity; 
    const topPlayers = [];

    for (const player of players) {
      if (player.score > topScore) {
        topScore = player.score;
        topPlayers.length = 0; 
        topPlayers.push(player);
      } else if (player.score === topScore) {
        topPlayers.push(player);
      }
    }

    const result =
      topPlayers.length > 1
        ? `It's a tie between: ${topPlayers.map(p => p.name).join(", ")}`
        : `Winner: ${topPlayers[0].name}`;

    res.json({
      message: "Game concluded successfully",
      results: {
        players: players.map(player => ({ name: player.name, score: player.score })),
        result,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error concluding game", error: error.message });
  }
}

  
module.exports = { createGame, getGame, updateGameScore, concludeGameAndAnnounceResults };



// async function endGame(req, res) {
//     try {
//         const  gameId  = req.params.gameId;
//         const game = await gameModels.findById(gameId);
        
//         if (!game) {
//             return res.status(404).json({ message: 'Game not found' });
//         }

//         game.status = 'completed';
//         await game.save();

//         res.json({ message: "Game ended successfully", game });

//         // const winner = game.players.reduce((prev, curr) => (prev.score > curr.score ? prev : curr));
//         // res.json({ winner });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }

// async function updateGame(req , res){
//     try{
//         const gameId = req.params.gameId;
//         const { playerFirstScore , playerSecondScore } = req.body;

//         if (!mongoose.Types.ObjectId.isValid(gameId)) {
//             return res.status(400).json({ message: "Invalid game ID" });
//         }

//         const game = await gameModels.findById(gameId);
//         if(!game) {
//             return res.status(404).json({ message: "Game not Found" });
//         }  

//         if (game.players[0]) game.players[0].score = playerFirstScore;
//         if (game.players[1]) game.players[1].score = playerSecondScore;

//         await game.save();
//         res.json(game);
//     }
//     catch (error){
//         res.status(500).json({ message: error.message });
//     }
// }