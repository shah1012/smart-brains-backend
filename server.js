const express = require("express");
const app = express();

const database = {
  users: [
    {
      id: 123,
      name: "John",
      email: "john@gmail.com",
      password: "cookies",
      entries: 0,
      joined: new Date(),
    },
  ],
};

// ROUTES
app.get("/", (req, res) => {
  res.send("this is working");
});

// SIGNIN ROUTE
app.post("/signin", (req, res) => {
  res.json("Signin");
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
