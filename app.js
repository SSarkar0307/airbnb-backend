// Core Module
const path = require('path');

// External Module
const express = require('express');
const mongoose= require('mongoose');
const cookieParser= require('cookie-parser');
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session) 

//Local Module
const storeRouter = require("./routes/storeRouter")
const hostRouter = require("./routes/hostRouter")
const authRouter = require("./routes/authRouter")
const adminRouter = require("./routes/adminRouter")
const rootDir = require("./utils/pathUtil");
const errorsController = require("./controllers/errors");
const uri  = require('./utils/databaseUtil');
const { loginStateHandler } = require('./controllers/authController');

const app = express();

const store = new MongoDBStore({
  uri: uri,
  collection: 'sessions'
});

app.use(session({
  secret: process.env.SESSION_SECRET || "secret_key",
  resave: false,
  saveUninitialized: false,
  store
}));

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

//Middleware for Login State set in res.locals
app.use(loginStateHandler)

app.use("/auth", authRouter);

app.use(storeRouter);
app.use("/host", hostRouter);
app.use("/admin", adminRouter);



app.use(express.static(path.join(rootDir, 'public')))

app.use(errorsController.pageNotFound);

const PORT = process.env.PORT || 3001;
serverStart= async ()=>{
  try{

    // await connectDB();
    await mongoose.connect(uri)
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server running on address http://localhost:${PORT}`);
    });
  }
  catch(err){
    console.log(err);
  }
};
serverStart();

// connectDB()
// .then(()=>{
//   app.listen(PORT, ()=>{
//     console.log(`Server running on address http://localhost:${PORT}`)
//   })
// })

