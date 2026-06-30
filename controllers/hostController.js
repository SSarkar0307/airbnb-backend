const Home = require("../models/home");
const Favourite = require('../models/favourite')
const Booking = require('../models/booking')

exports.getHostHomes = async (req, res, next) => {
  const ownerId = res.locals.userId;
  const registeredHomes = await Home.find({ owner: ownerId });
  res.status(200).json({ homes: registeredHomes });
};

exports.getHome = async (req, res, next) => {
  const homeId = req.params.homeId;
  const ownerId = res.locals.userId;
  const home = await Home.findOne({ _id: homeId, owner: ownerId });
  if (!home) {
    return res.status(404).json({ message: "Home not found" });
  }
  res.status(200).json({ home: home });
};

exports.postAddHome = async (req, res, next) => {
  const { houseName, price, location, rating, photoUrl } = req.body;
  const owner = res.locals.userId;
  const home = new Home({ houseName, price, location, rating, photoUrl, owner });

  await home.save();

  res.status(201).json({ message: "Home added", home: home });
};

exports.putEditHome = async (req, res, next) => {
  const homeId = req.params.homeId;
  const ownerId = res.locals.userId;
  const { houseName, price, location, rating, photoUrl } = req.body;

  let home = await Home.findOne({ _id: homeId, owner: ownerId });
  if (!home) {
    return res.status(404).json({ message: "Home not found" });
  }
  home.houseName = houseName;
  home.price = price;
  home.location = location;
  home.rating = rating;
  home.photoUrl = photoUrl;

  await home.save();
  res.status(200).json({ message: "Home updated", home: home });
};

exports.deleteHome = async (req, res, next) => {
  const homeId = req.params.homeId;
  const ownerId = res.locals.userId;

  const home = await Home.findOne({ _id: homeId, owner: ownerId });
  if (!home) {
    return res.status(404).json({ message: "Home not found" });
  }

  await Home.findByIdAndDelete(homeId);
  await Favourite.deleteMany({ homeId });
  await Booking.deleteMany({ homeId });

  res.status(200).json({ message: "Home deleted" });
};

// Booking track record for the logged-in host's homes
exports.getHostBookings = async (req, res, next) => {
  const ownerId = res.locals.userId;

  const myHomes = await Home.find({ owner: ownerId });
  const myHomeIds = myHomes.map((home) => home._id);

  const bookings = await Booking.find({ homeId: { $in: myHomeIds } })
    .populate('homeId')
    .populate('userId', 'firstName lastName email')
    .sort({ bookedAt: -1 });

  res.status(200).json({ bookings: bookings });
};
