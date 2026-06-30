// External Module
const express = require("express");
const adminRouter = express.Router();

// Local Module
const adminController = require("../controllers/adminController");
const { requireLogin, isSuperAdmin } = require('../controllers/authController');

adminRouter.get("/users", requireLogin, isSuperAdmin, adminController.getAllUsers);
adminRouter.get("/homes", requireLogin, isSuperAdmin, adminController.getAllHomes);
adminRouter.get("/bookings", requireLogin, isSuperAdmin, adminController.getAllBookings);

module.exports = adminRouter;
