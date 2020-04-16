const transcript = require("./functions/transcript.js");
const courseInfo = require("./functions/courseinfo.js");
const paramProcessor = require("./functions/paramProcessor.js")
const fs = require("fs");

var myJSON;

const params = paramProcessor.parse(process.argv);
console.log(params);

// Read the HAR file
try {
    myJSON = JSON.parse(fs.readFileSync(params.path));
} catch (err) {
    console.log(err.message);
    process.exit();
}

// Create output directory if it doesn't exist
if (!fs.existsSync("./output")) {
    try {
        fs.mkdirSync("./output");
    } catch (err) {
        console.log(err.message);
        process.exit();
    }
}

// Generate transcript
if (!params.noSubs) {
    const searchString = /https:\/\/app\.pluralsight\.com\/learner\/user\/courses.*transcript/;
    var obtainedTranscript = false
    try {
        myJSON.log.entries.forEach((element, index) => {
            if (!obtainedTranscript && searchString.test(element.request.url)) {
                const passedJSON = JSON.parse(element.response.content.text);
                transcript.generateTranscript(passedJSON);
                obtainedTranscript = true;
            }
        });
    } catch (err) {
        console.log(err.message);
        console.log("If you see this its probably because the HAR file you provided does not have a transcript, or that the format has changed.");
        console.log("If you are sure that the format has changed, please open an issue here: https://github.com/kwongtn/CourseExtractor/issues");
    }
}

// Generate and write courseInfo to output
if (!params.noInfo) {
    const searchString = /https:\/\/app\.pluralsight\.com\/learner\/content\/courses.*/
    var obtainedCourseInfo = false;
    try {
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
    } catch (err){
        console.log(err.message);
        console.log("If you see this its probably because the HAR file you provided does not have course info, or that the format has changed.");
        console.log("If you are sure that the format has changed, please open an issue here: https://github.com/kwongtn/CourseExtractor/issues")
    }

}

// Generate and write course bb code to output
if (!params.noBB) {
    const searchString = /https:\/\/app\.pluralsight\.com\/learner\/content\/courses.*/
    var obtainedCourseInfoBb = false;
    try{
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
    } catch (err){
        console.log(err.message);
        console.log("If you see this its probably because the HAR file you provided does not have course info, or that the format has changed.");
        console.log("If you are sure that the format has changed, please open an issue here: https://github.com/kwongtn/CourseExtractor/issues")
    }
}
