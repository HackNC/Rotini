const express = require("express")
const router = express.Router();

const db = require('../database')

router.get('/form', (req, res) => {
    res.sendFile(__dirname + "/form.html")
})

router.post('/submit-form/create', (req, res) => {
    const first_name = req.body.first_name
    const last_name = req.body.last_name
    const hacker_email = req.body.hacker_email
    const uuid = req.body.uuid
    db.run(
        `INSERT INTO hackerTable (firstName, lastName, email, uuid)
        VALUES (?, ?, ?, ?)`, 
        [first_name, last_name, hacker_email, uuid], () => {
            res.send(`Insert To hacker Successfully`)
        }
    )
  })

module.exports = router;