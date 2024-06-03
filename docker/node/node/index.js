const express = require("express");
const app = express();
const port = 3000;
const config = {
  host: "db",
  user: "root",
  password: "root",
  database: "nodedb",
  port: "3306",
};
const mysql = require("mysql2");
// const connection = mysql.createConnection(config);
const pool = mysql.createPool(config);

const sql = `INSERT INTO people(name) values('Wesley')`;
pool.query(sql, (err) => {
  if (err) {
    console.error("Error inserting data:", err);
    return;
  }
  console.log("Data inserted successfully");
});

async function getData() {
  try {
    const [rows] = await pool.promise().query("SELECT name FROM people");
    return rows;
  } catch (err) {
    console.error("Error fetching data:", err);
    return [];
  }
}

app.get("/", async (req, res) => {
  const people = await getData();
  let peopleList = "<ul>";
  people.forEach((person) => {
    peopleList += `<li>${person.name}</li>`;
  });
  peopleList += "</ul>";
  res.send(`<h1>Full Cycle</h1> 
   ${peopleList}
  `);
});

app.listen(port, () => {
  console.log("Rodando na porta " + port);
});
