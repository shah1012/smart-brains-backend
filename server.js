const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const app = express();

//connecting to our Psql database
const knex = require("knex");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: process.env.username,
    password: process.env.password,
    database: "smartbrain",
  },
});

app.use(express.json());
app.use(cors());

const database = {
  users: [
    {
      id: "123",
      name: "John",
      email: "john@gmail.com",
      password: "cookies",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "124",
      name: "Sally",
      email: "sally@gmail.com",
      password: "bananas",
      entries: 0,
      joined: new Date(),
    },
  ],
};

// ROUTES
app.get("/", (req, res) => {
  res.send(database.users);
});

// SIGNIN ROUTE
app.post("/signin", (req, res) => {
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json(database.users[0]);
  } else {
    res.status(400).json("error logging in");
  }
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  //inserting a new user into database
  db("users")
    .returning("*")
    .insert({
      email: email,
      name: name,
      joined: new Date(),
    })
    .then((user) => {
      res.json(user[0]);
    })
    .catch((err) => {
      res.status(400).json("unable to register");
    });
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;

  let found = false;

  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  });

  if (!found) {
    res.status(400).json("Not found");
  }
});

app.put("/image", (req, res) => {
  const { id } = req.body;

  let found = false;

  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });

  if (!found) {
    res.status(400).json("Not found");
  }
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
