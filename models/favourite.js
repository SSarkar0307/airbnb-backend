const mongoose = require('mongoose')
const Home = require('./home')
const User = require('./user')

const favouriteSchema = mongoose.Schema({

  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    unique: true
  },
  
  homeId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: Home,
    unique: true
  }
})

module.exports = mongoose.model('Favourite', favouriteSchema)