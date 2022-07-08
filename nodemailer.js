const nodemailer = require("nodemailer");
const { config } = require('./config/config');

// async..await is not allowed in global scope, must use a wrapper
const sendMail = async () => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: config.portMail,
    secure: true, // true for 465, false for other ports
    auth: {
      user: config.mailUser,
      pass: config.mailPass
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'hwilliamvictoria@gmail.com', // sender address
    to: "lina.arce.fory@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

sendMail();
