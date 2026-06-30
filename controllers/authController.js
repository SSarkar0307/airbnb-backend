const LoggedState = require('../models/auth')
const user = require('../models/user')
const User = require('../models/user')
// const { ObjectId } = require('mongodb') 


exports.postSignup = async (req, res, next) => {
    const { firstName, lastName, email, password, userType } = req.body;

    const exists = await User.findOne({ email });

    if (exists) {
        return res.status(409).json({ message: "User already exists" });
    }

    const newUser = new User({
        firstName, lastName, email, password, userType
    });
    await newUser.save();

    res.status(201).json({
        message: "Signup successful",
        user: {
            id: newUser._id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            userType: newUser.userType,
        },
    });
};

exports.postLogin = async (req, res, next) => {
    const { email, password } = req.body;
    //verification
    const userData = await User.findOne({ email });
    if (!userData) {
        return res.status(401).json({ message: "No such User Found" });
    }

    if (userData.password !== password) {
        return res.status(401).json({ message: "Invalid Password" });
    }

    req.session.LoggedIn = true;
    req.session.userId = userData._id.toString();
    req.session.userType = userData.userType;
    await new Promise((resolve, reject) => {
        req.session.save(err => {
            if (err) reject(err);
            else resolve();
        });
    });

    res.status(200).json({
        message: "Login successful",
        user: {
            id: userData._id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            userType: userData.userType,
        },
    });
};

exports.postLogout = async (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            return next(err);
        }

        res.clearCookie("connect.sid");
        res.status(200).json({ message: "Logout successful" });
    });
};

exports.getAuthStatus = (req, res, next) => {
    res.status(200).json({
        loggedIn: !!res.locals.LoggedIn,
        userId: res.locals.userId || null,
        userType: res.locals.userType || null,
    });
};


exports.requireLogin = (req, res, next) => {
    const LoggedIn = res.locals.LoggedIn;
    if (!LoggedIn) {
        return res.status(401).json({ message: "Login required" });
    }
    else next();
}

exports.loginStateHandler = (req, res, next) => {
    res.locals.LoggedIn = req.session?.LoggedIn;
    res.locals.userId = req.session?.userId;
    res.locals.userType = req.session?.userType;
    next();
}

exports.isGuest = async (req, res, next) => {
    const userId = req.session.userId;

    const { userType } = await User.findById(userId);
    if (userType !== 'guest') {
        // console.log(userType)
        return res.status(403).json({ message: "Only for Guests" });
    }
    else next();
}
exports.isHost = async (req, res, next) => {
    const userId = req.session.userId;

    const { userType } = await User.findById(userId);
    if (userType !== 'host') {
        return res.status(403).json({ message: "Only for Hosts" });
    }
    else next();
}

exports.isSuperAdmin = async (req, res, next) => {
    const userId = req.session.userId;

    const { userType } = await User.findById(userId);
    if (userType !== 'superAdmin') {
        return res.status(403).json({ message: "Only for Super Admin" });
    }
    else next();
}
