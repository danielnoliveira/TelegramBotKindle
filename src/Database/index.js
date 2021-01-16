const mongoose = require('mongoose');
const {user_mongodb,pass_mongodb} = require('./../../secrets');

mongoose.connect(`mongodb+srv://${user_mongodb}:${pass_mongodb}@cluster0.crlog.mongodb.net/readers?retryWrites=true&w=majority`,{
    useNewUrlParser: true, useUnifiedTopology:true
});

const db = mongoose.connection;
db.on('error',console.error.bind(console,'connection erorr!!!!'));
db.once('open',()=>{
    console.log('Connection worked!!!!');
});

module.exports = mongoose;