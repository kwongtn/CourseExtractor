const transcript = require("./functions/transcript.js");
const fs = require("fs");

var myJSON;

// You should pass a HAR json here


// Read the HAR file
try {
    myJSON = JSON.parse(fs.readFileSync("./app.pluralsight.com_transcript.har"));
} catch (err) {
    console.log(err.message);
}

// Create output directory if it doesn't exist
if (!fs.existsSync("./output")) {
    try {
        fs.mkdirSync("./output");
    } catch (err) {
        console.log(err.message);
    }
}

// Generate transcript
const searchString = /https:\/\/app\.pluralsight\.com\/learner\/user\/courses.*transcript/
myJSON.log.entries.forEach((element, index) => {
    if (searchString.test(element.request.url)){
        const passedJSON = JSON.parse(element.response.content.text);
        transcript.generateTranscript(passedJSON);
    }
});
