const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const app = express();

//connecting to our Psql database
const knex = require("knex");

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
  db.select("email", "hash")
    .from("login")
    .where("email", "=", req.body.email)
    .then((data) => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", req.body.email)
          .then((user) => {
            res.json(user[0]);
          })
          .catch((err) => res.status(400).json("unable to get user"));
      } else {
        //for wrong password
        res.status(400).json("wrong credentials");
      }
    })
    .catch((err) => res.status(400).json("wrong credentials"));
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  //inserting a new user into database

  //  hashing password
  const hash = bcrypt.hashSync(password);

  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx("users")
          .returning("*")
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date(),
          })
          .then((user) => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => {
    res.status(400).json("unable to register");
  });
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;

  //getting the user
  db.select("*")
    .from("users")
    .where({
      id,
    })
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json("Not found");
      }
    })
    .catch((err) => res.status(400).json("error getting user"));
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((data) => {
      res.json(data[0]);
    })
    .catch((err) => {
      res.status(400).json("unable to get entries");
    });
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
