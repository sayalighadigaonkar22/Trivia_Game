const mongoose = require('mongoose');
const { options } = require('../routes/gameRoutes');

const questionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    options: { type: [String], required:true },
    correctOption : { type: Number, required:true},
    difficulty: { type: String, enum:['easy' , 'medium' , 'hard'] , required:true},
    category: { type: String, required:true},
})

module.exports = mongoose.model('Question' , questionSchema);