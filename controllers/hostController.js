const Home = require("../models/home");
const Favourite = require('../models/favourite')

exports.getHostHomes = async (req, res, next) => {
  const registeredHomes = await Home.find();
  res.status(200).json({ homes: registeredHomes });
};

exports.getHome = async (req, res, next) => {
  const homeId = req.params.homeId;
  const home = await Home.findById(homeId);
  if (!home) {
    return res.status(404).json({ message: "Home not found" });
  }
  res.status(200).json({ home: home });
};

exports.postAddHome = async (req, res, next) => {
  const { houseName, price, location, rating, photoUrl } = req.body;
  const home = new Home({ houseName, price, location, rating, photoUrl });

  await home.save();

  res.status(201).json({ message: "Home added", home: home });
};

exports.putEditHome = async (req, res, next) => {
  const homeId = req.params.homeId;
  const { houseName, price, location, rating, photoUrl } = req.body;

  let home = await Home.findById(homeId);
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
  await Home.findByIdAndDelete(homeId);
  await Favourite.deleteMany({ homeId });

  res.status(200).json({ message: "Home deleted" });
};
