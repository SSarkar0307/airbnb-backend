// External Module
const express = require("express");
const storeRouter = express.Router();

// Local Module
const storeController = require("../controllers/storeController");
const { requireLogin, isGuest } = require('../controllers/authController');

storeRouter.get("/homes", storeController.getHomes);
storeRouter.get("/homes/:homeId", storeController.getHomeDetails);

storeRouter.get("/bookings", requireLogin, isGuest, storeController.getBookings);
storeRouter.post("/bookings/:homeId", requireLogin, isGuest, storeController.postAddBooking);
storeRouter.delete("/bookings/:homeId", requireLogin, isGuest, storeController.deleteBooking);

storeRouter.get("/favourites", requireLogin, isGuest, storeController.getFavouriteList);
storeRouter.post("/favourites/:homeId", requireLogin, isGuest, storeController.postAddToFavourite);
storeRouter.delete("/favourites/:homeId", requireLogin, isGuest, storeController.deleteFavourite);

module.exports = storeRouter;
