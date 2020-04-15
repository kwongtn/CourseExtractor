const transcript = require("./functions/transcript.js");
const courseInfo = require("./functions/courseinfo.js");
const fs = require("fs");

var myJSON;

// Passed params
console.log("Passed params: ");
process.argv.forEach((value, index) => {
    console.log(value, index);
})


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
const searchString = /https:\/\/app\.pluralsight\.com\/learner\/user\/courses.*transcript/;
var obtainedTranscript = false
myJSON.log.entries.forEach((element, index) => {
    if (!obtainedTranscript && searchString.test(element.request.url)) {
        const passedJSON = JSON.parse(element.response.content.text);
        transcript.generateTranscript(passedJSON);
        obtainedTranscript = true;
    }
});

// Generate and write courseInfo to output
const searchString = /https:\/\/app\.pluralsight\.com\/learner\/content\/courses.*/
var obtainedCourseInfo = false;
myJSON.log.entries.forEach((element, index) => {
    if (!obtainedCourseInfo && searchString.test(element.request.url)) {
        const passedJSON = JSON.parse(element.response.content.text);
        courseInfo.courseInfoTxt(passedJSON).then((output) => {
            try {
                fs.writeFileSync("./output/courseInfo_" + output.courseInfo.id + ".txt", output.text);
                console.log("Completed course output for " + output.courseInfo.id);
            } catch (err) {
                console.log(err);
                return false;
            }

            return true;
        });

        obtainedCourseInfo = true;
    }
});

// Generate and write course bb code to output
// TODO: searchString
const searchString = /https:\/\/app\.pluralsight\.com\/learner\/content\/courses.*/
var obtainedCourseInfoBb = false;
myJSON.log.entries.forEach((element, index) => {
    if (!obtainedCourseInfoBb && searchString.test(element.request.url)) {
        const passedJSON = JSON.parse(element.response.content.text);
        courseInfo.courseInfoTxt(passedJSON).then((output) => {
            try {
                fs.writeFileSync("./output/courseBb_" + output.courseInfo.id + ".txt", output.text);
                console.log("Completed bb text output for " + output.courseInfo.id);
            } catch (err) {
                console.log(err);
                return false;
            }

            return true;
        });

        obtainedCourseInfoBb = true;
    }
});
