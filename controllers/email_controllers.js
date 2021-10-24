const express = require("express")
const router = express.Router();

require("dotenv").config()
const nodemailer = require("nodemailer");

const QRCode = require('qrcode');

const db = require('../database')

let transporter = nodemailer.createTransport({
    pool: true, 
    host: "smtp.gmail.com",
    port: 465, 
    secure: true,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.log(error)
    } else {
        console.log("Server ready")
    }
})

/*
 * QRCode.toDataURL('I am a pony!', function (err, url) {
                console.log(url)
                res.render('editHacker', { hacker: row[0], hackerURL: url })
            })
 */

router.get("/sendEmail/:id", (req, res) => {
    const id = req.params.id
    db.all(
        'SELECT email from hackerTable WHERE id=?',
        [id], (err, email) => {
            QRCode.toFile(
                'public/qrcode.png',
                `http://localhost:4201/checkIn/${id}`, () => {
        
                let info = transporter.sendMail({
                from: '"HackNC" <hacknc@hacknc.com>',
                to: email[0].email,
                subject: "Hello",
                text: "",
                html: "Embedded image: <img src='unique@nodemailer.com' />",
                attachments: [{
                    filename: 'qrcode.png',
                    path: process.cwd() + "/public/qrcode.png",
                    cid: 'unique@nodemailer.com'
                }]})
                .catch((error) => {
                    console.log(error)
                    console.log("Message sent: %s", info.messageId);
                    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                })
                .then(() => {
                    res.send("Email sent")
                });
            })
        }
    )
})

router.get("/checkIn/:hackerId", (req, res) => {
    const hackerId = req.params.hackerId
    db.all(
        'SELECT * FROM eventTable', (err, rows) => {
          let eventTable = rows
          res.render('checkInForm', { hackerId: hackerId, table: eventTable })
        }
      )
})

module.exports = router;