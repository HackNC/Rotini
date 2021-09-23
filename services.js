const express = require("express")
const router = express.Router();

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('database.db');

router.get('/createHackerTable',(req,res)=>{
    db.serialize(function() {
      db.run("CREATE TABLE if not exists hacker_table (id integer, first_name text, last_name text, email email, uuid blob)");
      });
    res.send("Hacker Table Created")
})

router.get('/', (req, res) => {
    db.all(
        'SELECT * FROM hacker_table', (err, rows) => {
            res.send(rows)
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
        'INSERT INTO hacker_table VALUES (?, ?, ?, ?, ?)', [id, first_name, last_name, email, uuid], () => {
            res.send('Insert successfully')
        }
    )
})

router.get('/updateRow/:updatethis/:tothis', (req, res) => {
    const updatethis = req.params.updatethis
    const tothis = req.params.tothis
    req = 
    db.run(
        'UPDATE hacker_table SET id=? WHERE description=?', [tothis, updatethis], function(err) {
        if (err) {
          return console.error(err.message);
        }
        res.send({'updated': 1})
      
      });
})

router.get('/deleteRow', (req, res) => {
    db.run(
        'DELETE FROM hacker_table WHERE uuid=?', "123456789", (err) => {
            res.send({kq: 'row deleted'})
        }

    )
})

module.exports = router;