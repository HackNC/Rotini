const express = require("express")
const router = express.Router();

require("dotenv").config()
const nodemailer = require("nodemailer");

const QRCode = require('qrcode');

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

router.get("/sendEmail", (req, res) => {
    QRCode.toFile(
        'public/qrcode.png',
        "https://www.google.com", () => {

        let info = transporter.sendMail({
        from: '"HackNC" <hacknc@hacknc.com>',
        to: "thilehoangy@gmail.com",
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
})

module.exports = router;