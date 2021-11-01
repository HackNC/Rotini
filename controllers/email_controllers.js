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

function sendEmail(err, info) {
    QRCode.toFile(
        'public/qrcode.png',
        `https://rotini.hacknc.com/checkIn/${info.id}`, () => {

        let emailBody = transporter.sendMail({
        from: '"HackNC" <registration@hacknc.com>',
        to: info.email,
        subject: "Are you ready for HackNC 2021?",
        text: "",
        html: `
        <div 
            style="
                color: black;
            "
        >
            Hello ${info.firstName}, <br><br>
            
            Thanks for participating in HackNC 2021! 
            Attached in this email is a QR code that you can use 
            to get food and swag at the in-person event.
            Please save the code, we'll give further instructions on how to use them.
            The HackNC team is excited to have you this weekend. See you then!

            <br>
            <br>Find more details about the event on <a style="color: black" href="https://www.hacknc.com">hacknc.com<a>
            <br>Stay up to date with us on Instagram <a style="color: black" href="https://www.instagram.com/thehacknc/">@thehacknc</a>
            <br>Have questions? Reach out to us at <a style="color: black" href="mailto:registration@hacknc.com">registration@hacknc.com</a>.
            <!-- <br><br><img src='cid:unique@nodemailer.com' /> -->
            <br>
            <br>Best,
            <br>HackNC 2021
        </div>
        `
        ,
        attachments: [{
            filename: `${info.firstName}${info.lastName}.png`,
            path: process.cwd() + "/public/qrcode.png",
            cid: 'unique@nodemailer.com'
        }]})
        .catch((error) => {
            console.log(error)
            console.log("Message sent: %s", info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(emailBody));
        })
        // .then(() => {
        //     res.send("Email sent")
        // });
    })
}

router.get("/sendEmail/all", (req, res) => {
    db.all(
        'SELECT id, firstName, lastName, email from hackerTable', (err, rows) => {
            for (let i = 0; i < rows.length; i++) {
                sendEmail(err, rows[i])
            }
            res.send("Email sent")
        }
    )
})

router.get("/sendEmail/:id", (req, res) => {
    const id = req.params.id
    db.all(
        'SELECT id, firstName, lastName, email from hackerTable WHERE id=?',
        [id], (err, info) => {
            sendEmail(err, info[0])
            res.send("Email sent")
        }
    )
})

router.get("/checkIn/:hackerId", (req, res) => {
    const hackerId = req.params.hackerId
    db.all(
        'SELECT * FROM hackerTable WHERE id=?', [hackerId], (err, info) => {
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