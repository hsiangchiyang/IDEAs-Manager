const {model, Schema} = require('mongoose');

const ideaSchema = new Schema({
    title: String,
    body: String,
    createdAt: String,
    userId: String
});

module.exports = model('Idea', ideaSchema);