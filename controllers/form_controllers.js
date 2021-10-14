const express = require("express")
const router = express.Router();

const db = require('../database')

const QRCode = require('qrcode')


router.get('/addHackerForm', (req, res) => {
    res.sendFile(__dirname + "/addHackerForm.html")
})

router.get('/addEventForm', (req, res) => {
    res.sendFile(__dirname + "/addEventForm.html")
})

router.post('/addHacker', (req, res) => {
    const first_name = req.body.first_name
    const last_name = req.body.last_name
    const hacker_email = req.body.hacker_email
    db.run(
        `INSERT INTO hackerTable (firstName, lastName, email)
        VALUES (?, ?, ?)`, 
        [first_name, last_name, hacker_email], () => {
            res.redirect('/table/hackerTable')
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
                res.render('editEvent', { event: row[0]})
            }      
    )
})

router.post('/event/:id/update', (req, res) => {
    const id = req.params.id
    const eventName = req.body.eventName

    db.run(
        `UPDATE eventTable
        SET eventName = ?
        WHERE id=?`, [eventName,id], () => {
            res.redirect("/table/eventTable")
        }
    )
})

module.exports = router;