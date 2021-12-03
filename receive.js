const SMTPServer = require("smtp-server").SMTPServer;
const simpleParser = require('mailparser').simpleParser;

let message = "";

function onMessageReceived(message) {
    console.log(`Received new message: ${message}`);
    console.log(`Parsing message text...`);

    let messageText = message.text.trim();
    console.log(`Parsed message text`);
    console.log(messageText);

    let regex = RegExp("Projektbeschreibung:\\s(.+)\\s+Unterstationsnamen:\\s(.+)\\s+(\\d{1,2}-\\d{1,2}-\\d{1,4}).+(\\d{1,2}:\\d{1,2}:\\d{1,2}).(.+)\\s+(Ein|Aus)", "g");
    let match = messageText.match(regex);
    console.log(match);
    match.forEach(element => {
        console.log(regex.exec(element));
        regex.lastIndex = 0; // This is neccessary because of a bug in the ECMAS3 REGEX engine.
    });
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