// const Question = require('../models/questionModels');
// const axios = require('axios');

// async function fetchQuestionsLogic(category, difficulty, useStatic = false) {
//   try {
//     let questions;

//     if (useStatic) {
//       questions = await Question.find({ category, difficulty }).limit(2);

//       if (!questions || questions.length === 0) {
//         throw new Error('No static questions found in the database.');
//       }
//     } 
//     else {
//       const response = await axios.get('https://the-trivia-api.com/v2/questions', {
//         params: {
//           categories: category,
//           limit: 2,
//           difficulties: difficulty,
//         },
//       });
      
//       if (!response.data || response.data.length === 0) {
//         throw new Error('No questions available from the external API.');
//       }

//       const results = response.data;
//       questions = [];
//       for (let i = 0; i < results.length; i++) {
//         const q = results[i];
//         questions.push({
//           text: q.question.text, 
//           options: [q.correctAnswer, ...q.incorrectAnswers], 
//           correctOption: options.indexOf(q.correctAnswer), 
//           difficulty: q.difficulty,
//           category: q.category,
//         });
//       }
//     }

//     // res.json({ questions });
//     return questions;

//   } catch (error) {
//     console.error('Error fetching questions:', error.message);
//     // res.status(500).json({ message: 'Error fetching questions', error: error.message });
//     throw new Error(error.message);
//   }
// }

// module.exports = { fetchQuestionsLogic };


const Question = require('../models/questionModels');
const axios = require('axios');

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function fetchQuestionsLogic(category, difficulty, useStatic=false) {
  try {
    let questions;

    if (useStatic) {
      questions = await Question.find({ category, difficulty }).limit(2);

      if (!questions || questions.length === 0) {
        throw new Error('No static questions found in the database.');
      }
    } else {
      const response = await axios.get('https://the-trivia-api.com/v2/questions', {
        params: {
          categories: category,
          limit: 2,
          difficulties: difficulty,
        },
      });

      if (!response.data || response.data.length === 0) {
        throw new Error('No questions available from the external API.');
      }

      const results = response.data;
      questions = [];
      for (let i = 0; i < results.length; i++) {
        const q = results[i];
        
        let options = [q.correctAnswer, ...q.incorrectAnswers];
        options = shuffleArray(options);
        
        const correctOption = options.indexOf(q.correctAnswer);

        questions.push({
          text: q.question.text,
          options, 
          correctOption, 
          difficulty: q.difficulty,
          category: q.category,
        });
      }
    }

    return questions;
  } catch (error) {
    console.error('Error fetching questions:', error.message);
    throw new Error(error.message);
  }
}

module.exports = { fetchQuestionsLogic };
