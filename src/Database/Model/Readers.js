const mongoose = require('mongoose');
const ReaderSchema = require('./../Schema/Readers');

module.exports =  mongoose.model('Reader',ReaderSchema);