const express = require('express')
const router = express.Router()

const db = require('../database')

router.get('/table/hackerTable', (req, res) => {
  db.all(
    'SELECT * FROM hackerTable', (err, rows) => {
      let hackerTable = rows
      res.render('hackerTable', { table: hackerTable })
    }
  )
})

router.get('/table/eventTable', (req, res) => {
  db.all(
    'SELECT * FROM eventTable', (err, rows) => {
      let eventTable = rows
      res.render('eventTable', { table: eventTable })
    }
  )
})

module.exports = router