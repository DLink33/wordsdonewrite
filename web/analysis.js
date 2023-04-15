console.log("Running analysis.js");

async function getProseInfo() {
  const params = new URLSearchParams(document.location.search);
  const cid = params.get("cid");
  let query = `/api/${cid}`;
  const response = await fetch(query, {
    headers: { "Content-Type": "application/json" },
    method: "GET",
  });
  const proseInfo = await response.json();

  document.getElementById(
    "numWords"
  ).innerHTML = `Words: ${proseInfo.wordStats.numWords}`;
  const wordCountsList = document.getElementById("wordCounts");
  if (proseInfo.wordStats.numWords > 0) {
    // Only clear the list if there are new word counts to display
    wordCountsList.innerHTML = "";
    const sortedCounts = Object.entries(proseInfo.wordStats.wordCounts).sort(
      (a, b) => b[1] - a[1]
    );
    for (const [word, count] of sortedCounts) {
      const listItem = document.createElement("li");
      listItem.innerHTML = `${count}:\t${word} `;
      wordCountsList.appendChild(listItem);
    }
  }

  document.getElementById("userInput").value = proseInfo.prose;
}

document.addEventListener("DOMContentLoaded", () => {
  getProseInfo();
});
