const express = require("express")
const router = express.Router();

app.post('/submit-form', (req, res) => {
    const first_name = req.body.first_name
    const last_name = req.body.last_name
    const hacker_email = req.body.hacker_email
    res.end()
  })

module.exports = router;