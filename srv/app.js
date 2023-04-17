#!/usr/bin/env node

//This file is for running our Node server.

// One way to include libraries ("The common JS way")
const express = require("express"); //using express as oppose to http for certain functionality
const path = require("path");
const fs = require("fs");
const localdb = require("locallydb");

const db = new localdb("./mydb"); // create a new database in the mydb folder

const fileCollection = db.collection("files");
console.log("collection items:", fileCollection.items);

const app = express(); // creates an express server object
app.use(express.json()); // Tells the express server that our app is going to serve JSON format

// The port we are currently listening on
const port = 3000;
const webPath = path.resolve(`${__dirname}/../web`);

// This array will hold the common words
let commonWords = [];

// Read the common words file and store the words in the commonWords array
fs.readFile("common-words.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  commonWords = data.split("\n");
  // Put any code that depends on the commonWords array here
});

const parseData = (query) =>
  Object.fromEntries(query.split("&").map((q) => q.split("=")));

function countWords(input) {
  // Replace all non-alphanumeric characters with a space, and convert to lowercase
  const cleanedInput = input
    .replace(/[,.]/g, "")
    .replace(/["'`~_=+*&^%$#@“”,.;:><?!|\}\{\[\]\)\)…–]/g, "")
    .replace(/(\n)|(\r)/g, " ")
    .toLowerCase();
  console.log(cleanedInput);
  // Split the input into an array of words
  const words = cleanedInput.split(" ");
  // Filter out any empty strings from the array
  const nonEmptyWords = words.filter((word) => word !== "");
  // Create an empty object to hold the word counts
  const wordCounts = {};
  // Iterate over the non-empty words and update the word counts object
  for (const word of nonEmptyWords) {
    // If the word is already in the word counts object, increment its count
    if (wordCounts.hasOwnProperty(word)) {
      wordCounts[word]++;
    }
    // Otherwise, add the word to the word counts object with a count of 1
    else if (!commonWords.includes(word)) {
      wordCounts[word] = 1;
    }
  }
  // Create a response object that includes the non-empty words and word counts object
  const response = {
    numWords: nonEmptyWords.length,
    wordCounts: wordCounts,
  };
  // Return the response object
  return response;
}

app.get("/api/:cid", (req, res) => {
  const { cid } = req.params;
  console.log("finding file: ", cid);
  const rslt = fileCollection.get(parseInt(cid));
  console.log("result:", rslt);
  if (rslt?.prose) {
    res.send(
      JSON.stringify({ prose: rslt.prose, wordStats: countWords(rslt.prose) })
    );
  } else {
    res.sendStatus(404);
  }
});

app.post("/api", (req, res) => {
  //Non-express way of doing it
  /*   res.writeHead(200, {
    "Content-type": "application/json",
  });
  let body = "";
  req.on("data", (data) => {
    body += data;
  });
  req.on("end", () => {
    const parsed = parseData(body);
    const response = countWords(parsed["userInput"]);
    res.write(JSON.stringify(response));
    res.end();
  }); */
  // This is how to do it with the express server
  //const response = countWords(req.body.input); // "input" is defined from the request body
  if (req.body.input.length > 0) {
    const cid = fileCollection.insert({ prose: req.body.input }); //insert must take in a json object
    res.send(JSON.stringify({ cid: cid }));
  } // send back the response object
  else {
    res.sendStatus(403);
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

// Sends back our landing page
app.get("/", (req, res) => {
  res.sendFile(webPath + "/index.html");
});

app.get("/:fileName", (req, res) => {
  res.sendFile(webPath + "/" + req.params.fileName);
});

app.get("/assets/:fileName", (req, res) => {
  res.sendFile(webPath + "/assets/" + req.params.fileName);
});

app.get("/assets/fonts/:fileName", (req, res) => {
  res.sendFile(webPath + "/assets/fonts/" + req.params.fileName);
});

// app.get("/question/:id", (req, res) => {
//   // the colon (:) tells express that the following is an argument
//   const obj = getQuestion(req.params.id);
//   if (obj) {
//     res.send(JSON.stringify(obj));
//   } else {
//     res.send("{}");
//   }
// });

// app.get("/questions", (req, res) => {
//   res.send(JSON.stringify(array));
// });

// app.post("/question", (req, res) => {
//   const obj = addQuestion(req.body);
//   console.log("Request Body: ", req.body);
//   res.send(JSON.stringify(obj)); // responds with this (use .stringify to turn JSON obj into string
// });

// app.put("/question/:id", (req, res) => {
//   const obj = editQuestion(req.params.id, req.body);
//   if (obj) {
//     res.send(JSON.stringify(obj));
//   } else {
//     res.send("{}");
//   }
// });

// app.delete("/question/:id", (req, res) => {
//   deleteQuestion(req.params.id);
//   res.send("{}");
// });
