const SMTPServer = require("smtp-server").SMTPServer;
const simpleParser = require('mailparser').simpleParser;
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function main(alarmText) {

  // Modify config as needed
  const config = {
    host: "192.168.0.200",
    port: 25,
    secure: false, // true for 465, false for other ports
  }
  
  let transporter = nodemailer.createTransport(config);

  const message = {
    from: "ga-winterthur@engiega.ch", // sender address
    to: "benedikt.schniepp@engie.com", // list of receivers split by a coma
    subject: "ALARM Zeughausstrasse 70", // Subject line
    text: 
      "Neuer Alarm im Projekt Zeughausstrasse 70:\n\n"+
      `${alarmText}\n\n\n`+
      "Diese Mail wurde mit einem Skript umgewandelt:\n"+
      `HOST: ${config.host}\n`+
      `PORT: ${config.port}` // plain text body
  };

  // send mail with defined transport object
  let info = await transporter.sendMail(message);

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}  

main();