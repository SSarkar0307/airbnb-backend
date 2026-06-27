const mongoose =  require('mongoose')

// const AuthDB = mongoose.Schema({
//     username: String,
//     password: String,
//     LoggedIn: Boolean
// })

// exports.mongoose.model("AuthDB", AuthDB);


const loggedState = mongoose.Schema({
    uid: Number,
    LoggedIn : Boolean,
})

module.exports = mongoose.model("LoggedState", loggedState);
//Not using anymore