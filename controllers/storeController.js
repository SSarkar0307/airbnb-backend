const Favourite = require("../models/favourite");
const Home = require("../models/home");
const LoggedState = require('../models/auth')


exports.getHomes = async (req, res, next) => {
  const registeredHomes = await Home.find();
  res.status(200).json({ homes: registeredHomes });
};

exports.getHomeDetails = async (req, res, next) => {
  const homeId = req.params.homeId;
  const home = await Home.findById(homeId);
  if (!home) {
    return res.status(404).json({ message: "Home not found" });
  }
  res.status(200).json({ home: home });
};

exports.getBookings = (req, res, next) => {
  res.status(200).json({ bookings: [] });
};

//favourite controllers

exports.getFavouriteList = async (req, res, next) => {
  const userId = res.locals.userId;
  let favouriteHomeIdandObjects = await Favourite.find({ userId }).populate('homeId');
  const favouriteHomes = favouriteHomeIdandObjects.map((item) => item.homeId);

  res.status(200).json({ favourites: favouriteHomes });
};

exports.postAddToFavourite = async (req, res, next) => {
  try {
    const homeId = req.params.homeId;
    const userId = res.locals.userId;
    const favhome = new Favourite({ userId, homeId });

    await favhome.save();
  }
  catch (error) {
    console.log("Error while marking favourite: ", error);
    return res.status(500).json({ message: "Error while marking favourite" });
  }
  res.status(201).json({ message: "Added to favourites" });
};

exports.deleteFavourite = async (req, res, next) => {
  const homeId = req.params.homeId;
  try {
    await Favourite.findOneAndDelete({ homeId });
  }
  catch (error) {
    console.log('Error while removing from Favourite');
    return res.status(500).json({ message: "Error while removing from favourite" });
  }
  res.status(200).json({ message: "Removed from favourites" });
};
