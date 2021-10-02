const express = require('express')
const app = express()
const PORT = process.env.PORT || 4201

app.use(express.json())
app.use(express.urlencoded({extended: true}))

const path = require('path')
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))

const controllers = require('./controllers/control_controllers')
app.use(controllers)

app.listen(PORT, () => {
    console.log(`Listening to localhost:${PORT}`)
})
