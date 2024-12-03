const express = require('express');
const router = express.Router();

const { fetchQuestions , submitAnswer} = require('../controllers/questionControllers');
router.get('/:gameId/questions', fetchQuestions);
// router.post('/gameId/answer' , submitAnswer);
router.post('/:gameId/answer', (req, res, next) => {
    console.log('Route hit: POST /:gameId/answer');
    next();
  }, submitAnswer);  

module.exports = router;