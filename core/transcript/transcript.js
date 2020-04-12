const https = require('https');
const fs = require('fs');
const converter = require('./converter');

var myJSON;
const DEBUG = false;

// Read the HAR file
try {
    myJSON = JSON.parse(fs.readFileSync("./app.pluralsight.com_transcript.har"));
    // console.log(myJSON);
} catch (err) {
    console.log(err.message);
}

myJSON.log.entries.forEach((element, index) => {
    const searchString = /https:\/\/app\.pluralsight\.com\/learner\/user\/courses.*transcript/
    if (searchString.test(element.request.url)) {
        var transcript = JSON.parse(element.response.content.text);
        // console.log(transcript);

        // Create output directory if it doesn't exist
        if (!fs.existsSync("./transcriptOutput")) {
            try {
                fs.mkdirSync("./transcriptOutput");
            } catch (err) {
                console.log(err.message);
            }
        }
});


