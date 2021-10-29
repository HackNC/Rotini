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

router.get("/sendEmail/all", (req, res) => {
    db.all(
        'SELECT firstName, lastName, email from hackerTable', (err, info) => {
            console.log(info)
            
        }
    )
})

router.get("/sendEmail/:id", (req, res) => {
    const id = req.params.id
    db.all(
        'SELECT firstName, lastName, email from hackerTable WHERE id=?',
        [id], (err, info) => {
            QRCode.toFile(
                'public/qrcode.png',
                `http://localhost:4201/checkIn/${id}`, () => {
        
                let emailBody = transporter.sendMail({
                from: '"HackNC" <hacknc@hacknc.com>',
                to: info[0].email,
                subject: "Hello",
                text: "",
                // html: "Embedded image: <img src='unique@nodemailer.com' />",
                attachments: [{
                    filename: `${info[0].firstName}${info[0].lastName}.png`,
                    path: process.cwd() + "/public/qrcode.png",
                    cid: 'unique@nodemailer.com'
                }]})
                .catch((error) => {
                    console.log(error)
                    console.log("Message sent: %s", info.messageId);
                    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(emailBody));
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
        'SELECT * FROM hackerTable WHERE id=?', [hackerId], (err, info) => {
            console.log(info)
            db.all(
                'SELECT * FROM eventTable', (err, eventTable) => {
                    res.render('checkInForm', { 
                        process: true,
                        firstName: info[0]["firstName"], 
                        hackerId: hackerId, 
                        table: eventTable 
                    })
                }
            )
        }
    )
})

module.exports = router;