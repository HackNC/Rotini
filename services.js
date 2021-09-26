const express = require("express")
const router = express.Router();

const db = require('./database')

router.get('/createHackerTable',(req,res)=>{
    db.serialize(function() {
        db.run(
            "CREATE TABLE if not exists hackerTable (id integer primary key, firstName text, lastName text, email email, uuid blob)"
        );
        // db.close();
    });
    res.send("Hacker Table Created")
})

router.get('/createEventTable',(req,res)=> {
    db.serialize(function(){
        db.run(
            "CREATE TABLE if not exists eventTable (id integer primary key, eventName text)"
        );
        // db.close();
    });
    res.send("Event Table Created")
})

router.get('/table/:table', (req, res) => {
    const table = req.params.table
    db.all(
        `SELECT * 
        FROM ${table}`, (err, rows) => {
            (err) && console.error(err)
            res.send(rows)
        }
    )
})


router.get('/insert/:eventName',(req,res) => {
    const id = req.params.id;
    const eventName = req.params.eventName;

    db.run(
        `INSERT INTO eventTable
        VALUES (?,?)`,
        [id, eventName],
        () =>{
            res.send('Insert into Event Table successfully')
        }
    )
})

router.get('/insert/:firstName/:lastName/:email/:uuid', (req, res) => {
    const firstName = req.params.firstName;
    const lastName = req.params.lastName;
    const email = req.params.email;
    const uuid = req.params.uuid;
    db.run(
        `INSERT INTO hackerTable 
        VALUES (1, ?, ?, ?, ?)`, 
        [firstName, lastName, email, uuid], 
        () => {
            res.send('Insert To Hacker Table Successfully')
        }
    )
})

router.get('/updateRow/:table/:updateThis/:toThis', (req, res) => {
    const updateThis = req.params.updateThis
    const toThis = req.params.toThis
    const table = req.params.table 
    db.run(
        `UPDATE ${table} 
        SET id=? 
        WHERE description=?`, 
        [toThis, updateThis], 
        (err) => {
            if (err) {
                return console.error(err.message);
            }
        res.send({'updated': 1})
      
      });
})

router.post('/deleteRow/:table/:toDelete/:deleteDetail', (req, res) => {
    const table = req.params.table
    const toDelete = req.params.toDelete
    const deleteDetail = req.params.deleteDetail

    db.run(
        `DELETE FROM ${table} 
        WHERE ${toDelete}=?`, 
        [deleteDetail], 
        (err) => {
            (err) && console.error(err) 
            res.send({kq: 'row deleted'})
        }

    )
})

module.exports = router;