// External Module
const express = require("express");
const hostRouter = express.Router();

// Local Module
const hostController = require("../controllers/hostController");
const { requireLogin, isHost } = require('../controllers/authController');

hostRouter.get("/homes", requireLogin, isHost, hostController.getHostHomes);
hostRouter.get("/bookings", requireLogin, isHost, hostController.getHostBookings);
hostRouter.get("/homes/:homeId", requireLogin, isHost, hostController.getHome);
hostRouter.post("/homes", requireLogin, isHost, hostController.postAddHome);
hostRouter.put("/homes/:homeId", requireLogin, isHost, hostController.putEditHome);
hostRouter.delete("/homes/:homeId", requireLogin, isHost, hostController.deleteHome);

module.exports = hostRouter;
