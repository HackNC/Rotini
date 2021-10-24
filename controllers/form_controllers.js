const express = require("express")
const router = express.Router();

const db = require('../database')

const QRCode = require('qrcode');
const parse = require('csv-parse');
const formidable = require('formidable');
const fs = require('fs');
const { 
    v4: uuidv4,
  } = require('uuid');



router.get('/uploadcsv', (req, res) => {
    res.sendFile(__dirname + "/uploadcsvFrom.html")
})
router.get('/addHackerForm', (req, res) => {
    res.sendFile(__dirname + "/addHackerForm.html")
})

router.get('/addEventForm', (req, res) => {
    res.sendFile(__dirname + "/addEventForm.html")
})

router.post('/addData', (req, res) => {
    const file = req.body.filename

    new formidable.IncomingForm().parse(req, (err, fields, files) => {

        fs.readFile(files.filename.path, 'utf8', (err, data) => {
            if (err) {
                console.error(err)
                return
            }

            parse(data, {

            }, function (err, output) {

                for (let i = 1; i < output.length; i++) {
                    db.run(
                        `INSERT OR IGNORE INTO hackerTable (firstName,lastName,email,typeformID)
                        VALUES (?,?,?,?)
                        `,
                        [output[i][1], output[i][2], output[i][5], output[i][0]], () => {

                        })
           
                }
                res.redirect('/table/hackerTable')
            })
        })
    })

})

router.post('/addHacker', (req, res) => {
    const first_name = req.body.first_name
    const last_name = req.body.last_name
    const hacker_email = req.body.hacker_email
    db.run(
        `INSERT INTO hackerTable (firstName, lastName, email, typeformID)
        VALUES (?, ?, ?, ?)`,
        [first_name, last_name, hacker_email, uuidv4()], () => {
            res.redirect('/table/hackerTable')
        }
    )
})
router.get('/addHackerEventForm', (req, res) => {
    res.sendFile(__dirname + "/addEventHacker.html")
})

router.post('/hackerCheckin', (req, res) => {
    const hackerId = req.body.hackerId
    const eventId = req.body.eventId


    db.all(
        `SELECT hackerId FROM hackerEventTable Where eventId = ? AND hackerId = ?`, [eventId, hackerId], (err, rows) => {
            let queryrows = rows

            if (rows.length < 1) {
                db.all(
                    `INSERT INTO hackerEventTable (hackerId, eventId)
                 VALUES (?,?)`, [hackerId, eventId], () => {
                    res.redirect('/table/hackerEventTable')
                }
                )

            } else {
                res.send("fail");
            }
        }


    )
})

router.post('/addEvent', (req, res) => {
    const eventName = req.body.eventName
    db.run(
        `INSERT INTO eventTable (eventName)
        VALUES (?)`,
        [eventName], () => {
            res.redirect('/table/eventTable')
        }
    )
})

router.get('/hacker/:id/delete', (req, res) => {
    const id = req.params.id
    db.run(`DELETE FROM hackerTable WHERE id=?`, [id], () => {
        res.redirect('/table/hackerTable')
    })
})

router.get('/hacker/:id/profile', (req, res) => {
    const id = req.params.id
    db.all(
        `SELECT * FROM hackerTable WHERE id=?`, [id], (err, row) => {
            QRCode.toDataURL('I am a pony!', function (err, url) {
                console.log(url)
                res.render('editHacker', { hacker: row[0], hackerURL: url })
            })
        }
    )
})

router.post('/hacker/:id/update', (req, res) => {
    const id = req.params.id
    const firstName = req.body.first_name
    const lastName = req.body.last_name
    const email = req.body.hacker_email
    console.log(firstName)
    db.run(
        `UPDATE hackerTable
        SET firstName=?, lastName=?, email=?
        WHERE id=?`, [firstName, lastName, email, id], () => {
        res.redirect("/table/hackerTable")
    }
    )
})

router.get('/event/:id/delete', (req, res) => {
    const id = req.params.id
    db.run(`DELETE FROM eventTable WHERE id=?`, [id], () => {
        res.redirect('/table/eventTable')
    })
})

router.get('/event/:id/profile', (req, res) => {
    const id = req.params.id
    db.all(
        `SELECT * FROM eventTable WHERE id=?`, [id], (err, row) => {
            res.render('editEvent', { event: row[0] })
        }
    )
})

router.post('/event/:id/update', (req, res) => {
    const id = req.params.id
    const eventName = req.body.eventName

    db.run(
        `UPDATE eventTable
        SET eventName = ?
        WHERE id=?`, [eventName, id], () => {
        res.redirect("/table/eventTable")
    }
    )
})

module.exports = router;