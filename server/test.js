import nodemailer from "nodemailer"

const EMAIL = "brianpolier@zohomail.com"
const PWD = "G33kz)<5N>*k"
const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
        user: EMAIL,
        pass: PWD
    }
});

var mailOptions = {
    from: EMAIL,
    to: "unknown989@protonmail.com",
    subject: "You've requested a password reset",
    html: `<div style="width: 100%; height: 100%; background-color: #fafafa;">
      <p>Hi, <strong> Brian </strong></p>
      <p>you have requested to reset your password, to do so click the button below or the link</p>
      <p align="center"><button style="border: 0; outline: 0; padding: 10px; border-radius: 8px; background-color: #444; color: white; font-family: Cairo,Roboto; cursor: pointer; width: 100px;"> Reset </button></p>
      <br /><br /><a href="https://google.com/"> Google </a>
      <p>Please note that the link is only valid for 5 minutes</p>
      <p>If that wasn't you, just ignore this message.</p>
      <p>Brian Polier from Terker.</p>
      </div>`,
};
console.log(mailOptions);
transporter.sendMail(mailOptions, (err, _info) => {
    if (err) {
        console.log("Error :" + err.message)
    } else {
        console.log(_info)
    }
    console.log("E-mail was sent")
});
