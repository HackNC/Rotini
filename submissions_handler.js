const express = require("express")
const router = express.Router();

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('database.db', (err) => {
    err ? console.error(err.message) : console.log("Connected to database")
});

app.post('/submit-form/create', (req, res) => {
    const first_name = req.body.first_name
    const last_name = req.body.last_name
    const hacker_email = req.body.hacker_email
    db.run(
        `INSERT INTO ${hacker_table} 
        VALUES (?, ?, ?, ?, ?)`, [id, first_name, last_name, hacker_email, uuid], () => {
            res.send(`Insert To ${table} Successfully`)
        }
    )
    res.end()
  })

module.exports = router;