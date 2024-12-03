const Game = require('../models/gameModels');
const mongoose = require('mongoose');
const { fetchQuestionsLogic } = require('../services/questionServices');
const { updateGameScore } = require('../controllers/gameControllers')
const Question = require('../models/questionModels');


async function fetchQuestions(req, res) {

  const { gameId } = req.params;
  const { category, difficulty, useStatic } = req.query;

  try {

    if (!mongoose.Types.ObjectId.isValid(gameId)) {
      return res.status(400).json({ message: 'Invalid gameId' });
    }

    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const questionsData = await fetchQuestionsLogic(category, difficulty, useStatic);

    const savedQuestions = await Question.insertMany(questionsData);

    const questionIds = [];
    for (const savedQuestion of savedQuestions) {
      questionIds.push(savedQuestion._id);
    }

    game.questions = questionIds;  
    await game.save();

   
    res.json({ questions: savedQuestions });
  } catch (error) {
    console.error('Error in fetchQuestions:', error.message);
    res.status(500).json({ message: 'Error fetching questions', error: error.message });
  }
}

async function submitAnswer(req, res) {
  console.log('Controller hit: submitAnswer');
  try {
    const { gameId } = req.params;
    console.log('Request params:', req.params);
    const { playerId, questionId, submittedAnswer } = req.body;
    console.log('Request body:', req.body);

    if (!mongoose.Types.ObjectId.isValid(gameId) || !mongoose.Types.ObjectId.isValid(questionId)) {
      return res.status(400).json({ message: 'Invalid gameId or questionId' });
    }

    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const submittedAnswerIndex = question.options.indexOf(submittedAnswer);
    const isCorrect = question.correctOption === submittedAnswerIndex;


    await updateGameScore(gameId, playerId, isCorrect, question.difficulty);

    res.json({
      message: 'Answer submitted successfully',
      isCorrect,
      correctAnswer: question.correctOption,
    });
  } catch (error) {
    console.error('Error in submitAnswer:', error.message);
    res.status(500).json({ message: 'Error submitting answer', error: error.message });
  }
}

module.exports = { fetchQuestions , submitAnswer};