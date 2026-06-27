const mongoose = require('mongoose')
const Home = require('./home')
const User = require('./user')

const favouriteSchema = mongoose.Schema({

  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true
  },
  
  homeId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: Home,
    required: true
  }
})

module.exports = mongoose.model('Favourite', favouriteSchema)