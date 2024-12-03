const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    players: [
        {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
            name: { type: String, required: true },
            score: {type:Number , default:0 }
        }
    ],
    category: { type: String, required: true },
    status: { type: String, enum: ['ongoing', 'completed'], default: 'ongoing' },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question'}],
});

module.exports = mongoose.model('Game', gameSchema);