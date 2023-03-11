// This file runs the logic and dynamic element from the client side.

console.log("Running index.js...");

// NOTE: Any function given the 'async' keyword means that the function implicitly returns a Promise
// This allows us to use the 'await' keyword



/////// TEST FUNCTIONS ///////

// This function tests the POST method, which should post to the server the information defined herein
async function testPOST() {
  // NOTE: The 'await' keyword waits for the Promise to be fulfilled and then returns the result
  // Without the "await" keyword, the fetch method is non-blocking meaning stuff can execute
  // before the promise is resolved
  const rslt = await fetch("/question", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question: "Why is the sky blue?",
      answer: "The upper atmosphere refracts more blue light than red light.",
    }),
  });
  const json = await rslt.json(); //convert back from string to JSON object
  console.log("JSON object: ", json);
}

async function testPUT(id) {
  const rslt = await fetch("/question/" + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question: "What time is it?",
      answer: "Time for you to get a watch.",
    }),
  });
  const json = await rslt.json(); //convert back from string to JSON object
  console.log("JSON object: ", json);
}

async function testDELETE(id) {
  const rslt = await fetch("/question/" + id, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  const json = await rslt.json(); //convert back from string to JSON object
  console.log("JSON object: ", json);
}