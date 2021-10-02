const express = require("express")
const router = express.Router();

const db = require('../database')

router.get('/form', (req, res) => {
    res.sendFile(__dirname + "/form.html")
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

module.exports = router;