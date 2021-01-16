const mongoose = require('mongoose');

const ReaderSchema = new mongoose.Schema({
    email:String,
    chatId:String
});

module.exports = ReaderSchema;

