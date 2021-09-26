const bodyParser = require("body-parser");
const express = require("express")
const router = express.Router();

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('database.db', (err) => {
    err ? console.error(err.message) : console.log("Connected to database")
});

router.get('/createHackerTable',(req,res)=>{
    db.serialize(function() {
        db.run("CREATE TABLE if not exists hacker_table (id integer, first_name text, last_name text, email email, uuid blob)");
        db.close();
    });
    res.send("Hacker Table Created")
})

router.get('/createEventTable',(req,res)=> {
    db.serialize(function(){
        db.run("CREATE TABLE if not exists events_table (id integer, eventName text)");
        db.close();
    });
    res.send("Event Table Created")
})

router.get('/', (req, res) => {
    db.all(
        `SELECT * 
        FROM ${hacker_table}`, (err, rows) => {
            res.send(rows)
        }
    )
})


router.get('/insert/:id/:eventName',(req,res) => {
    const id = req.params.id;
    const eventName = req.params.eventName;

    db.run(
        `INSERT INTO ${event_table} VALUES (?,?)`,[id, eventName],() =>{
            res.send('Insert into Event Table successfully')
        }
    )
})

router.get('/insert/:id/:first_name/:last_name/:email/:uuid', (req, res) => {
    const id = req.params.id;
    const first_name = req.params.first_name;
    const last_name = req.params.last_name;
    const email = req.params.email;
    const uuid = req.params.uuid;
    db.run(
        `INSERT INTO ${hacker_table} 
        VALUES (?, ?, ?, ?, ?)`, [id, first_name, last_name, email, uuid], () => {
            res.send('Insert To Hacker Table Successfully')
        }
    )
})

router.get('/updateRow/:table/:updatethis/:tothis', (req, res) => {
    const updatethis = req.params.updatethis
    const tothis = req.params.tothis
    const table = req.params.table 
    db.run(
        `UPDATE ${table} 
        SET id=? 
        WHERE description=?`, 
        [tothis, updatethis], 
        function(err) {
            if (err) {
                return console.error(err.message);
            }
        res.send({'updated': 1})
      
      });
})

router.get('/deleteRow', (req, res) => {
    db.run(
        `DELETE FROM ${hacker_table} 
        WHERE uuid=?`, "123456789", (err) => {
            res.send({kq: 'row deleted'})
        }

    )
})

module.exports = router;