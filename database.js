var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('database.db', (err) => {
    err ? console.error(err.message) : console.log("Connected to database")
});

module.exports = db;