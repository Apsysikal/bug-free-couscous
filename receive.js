const SMTPServer = require("smtp-server").SMTPServer;
const simpleParser = require('mailparser').simpleParser;
const nodemailer = require("nodemailer");

let message = "";

function onMessageReceived(message) {
    console.log(`Received new message: ${message}`);
    console.log(`Parsing message text...`);
    
    let messageText = message.text.trim().replace(/ +(?= )/g, '');
    console.log(`Parsed message text: ${messageText}`);
}



const server = new SMTPServer({
    authOptional:true,

    onData(stream, session, callback) {
      stream.on("data", (chunk) => {
          message += chunk;
      });

      stream.on("end", () => {
        simpleParser(message, {
            skipTextToHtml: true
        })
            .then(parsed => {
                onMessageReceived(parsed);
            })
            .catch(err => {console.log(err.message)});

        console.log(`Clearing message buffer. Waiting for next message.`);
        // Reset
        message = "";
        callback(null);
      });
    }
});

server.on("error",(e) => {
    console.log(e.message);
});

server.listen(10025);