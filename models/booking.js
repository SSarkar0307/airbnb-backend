const mongoose = require('mongoose')
const Home = require('./home')
const User = require('./user')

const bookingSchema = mongoose.Schema({

  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true
  },

  homeId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: Home,
    required: true
  },

  bookedAt:{
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Booking', bookingSchema)
