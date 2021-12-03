const SMTPServer = require("smtp-server").SMTPServer;
const simpleParser = require("mailparser").simpleParser;
const EventEmitter = require("event");

class Server extends EventEmitter {
    constructor() {
        super();

        this.server = new SMTPServer({
            authOptional: true,
            onData: this.onData
        });

        this.regex = "";
    }

    loadRegex (regexString) {
        const regex = new RegExp(regexString);
    }

    onData (stream, session, callback) {
        let message = "";

        stream.on("data", (chunk) => {
            message += chunk;
            console.debug(`Received chunk: ${chunk}`);
        });

        stream.on("end", () => {
            console.debug("End of data reached");

            simpleParser(message, {skipTextToHtml: true})
                .then((parsedMessage) => {
                    console.debug("Parsing message");
                    this.onMessageReceived(parsedMessage);
                })
                .catch((error) => {
                    console.error(error.message);
                });

            message = "";
            callback(null);
        });
    }

    onMessageReceived (message) {
        console.info(`Received message: ${message}`);

        console.debug("Trimming message");
        let messageText = message.text.trim();

        if (this.regex === "") {
            console.log("Regular expression not set. Skipping further message processing");
            return;
        }

        let matches = messageText.match(this.regex);

        if (!matches) {
            console.log("No matches found. Skipping further message processing");
            return;
        }

        console.log(`Found matches: ${matches.length}`);

        matches.forEach(match => {
            this.emit("message", match);
            this.regex.lastIndex = 0;
        });
    }
}