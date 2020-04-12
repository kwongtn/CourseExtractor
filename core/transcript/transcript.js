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
