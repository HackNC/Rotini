const express = require('express')
const router = express.Router()

const services = require('./tables_controllers')
router.use(services)

const forms = require('./form_controllers')
router.use(forms)

const views = require('./views_controllers')
router.use(views)

const email = require('./email_controllers');
router.use(email)

module.exports = router