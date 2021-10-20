const SMTPServer = require("smtp-server").SMTPServer;
const simpleParser = require('mailparser').simpleParser;
const nodemailer = require("nodemailer");

let message = "";

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
                messageText = parsed.text.trim().replace(/ +(?= )/g, '');
                console.log(messageText)
                main(messageText).catch(console.error);
            })
            .catch(err => {console.log(err.message)});

        
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