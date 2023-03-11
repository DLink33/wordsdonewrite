#!/usr/bin/env node

//This file is for running our Node server.

// One way to include libraries ("The common JS way")
const express = require("express"); //using express as oppose to http for certain functionality
const path = require("path");

const app = express(); // creates an express server object

app.use(express.json()); // Tells the express server that our app is going to serve JSON format
// The port we are currently listening on
const port = 3000;

const webPath = path.resolve(`${__dirname}/../web`);

// Sends back our landing page
app.get("/", (req, res) => {
  res.sendFile(webPath + "/index.html");
});

// Send back our landing page
app.get("/index.html", (req, res) => {
  res.sendFile(webPath + "/index.html");
});

// Send back our JavaScript file
/* app.get("/index.js", (req, res) => {
  res.sendFile(webPath + "/index.js");
}); */

app.get("/question/:id", (req, res) => {
  // the colon (:) tells express that the following is an argument
  const obj = getQuestion(req.params.id);
  if (obj) {
    res.send(JSON.stringify(obj));
  } else {
    res.send("{}");
  }
});

app.get("/questions", (req, res) => {
  res.send(JSON.stringify(array));
});

app.post("/question", (req, res) => {
  const obj = addQuestion(req.body);
  console.log("Request Body: ", req.body);
  res.send(JSON.stringify(obj)); // responds with this (use .stringify to turn JSON obj into string
});

app.put("/question/:id", (req, res) => {
  const obj = editQuestion(req.params.id, req.body);
  if (obj) {
    res.send(JSON.stringify(obj));
  } else {
    res.send("{}");
  }
});

app.delete("/question/:id", (req, res) => {
  deleteQuestion(req.params.id);
  res.send("{}");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
