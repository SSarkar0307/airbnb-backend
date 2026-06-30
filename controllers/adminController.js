const Home = require("../models/home");
const User = require("../models/user");
const Booking = require("../models/booking");

exports.getAllUsers = async (req, res, next) => {
  const users = await User.find({}, 'firstName lastName email userType');
  res.status(200).json({ users: users });
};

exports.getAllHomes = async (req, res, next) => {
  const homes = await Home.find().populate('owner', 'firstName lastName email');
  res.status(200).json({ homes: homes });
};

exports.getAllBookings = async (req, res, next) => {
  const bookings = await Booking.find()
    .populate({
      path: 'homeId',
      populate: { path: 'owner', select: 'firstName lastName email' }
    })
    .populate('userId', 'firstName lastName email')
    .sort({ bookedAt: -1 });

  res.status(200).json({ bookings: bookings });
};
