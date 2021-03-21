const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const app = express();

//connecting to our Psql database
const knex = require("knex");

// controllers
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: process.env.USRNAM,
    password: process.env.PASS,
    database: "smartbrain",
  },
});

app.use(express.json());
app.use(cors());

// ROUTES
app.get("/", (req, res) => {
  res.send("success");
});

// SIGNIN ROUTE
app.post("/signin", (req, res) => {
  signin.handleSignin(req, res, db, bcrypt);
});

app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

app.get("/profile/:id", (req, res) => {
  profile.handleProfile(req, res, db);
});

app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});

app.post("/imageurl", (req, res) => {
  image.handleApi(req, res);
});

app.listen(3000, () => {
  console.log("App is running on port 3000");
});

/*
  / -> res = this is working
  /signin -> POST -> res = success || fail
  /register -> POST = user
  /profile/:userId -> get request
  /image -> PUT -> user
*/
