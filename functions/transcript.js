const https = require('https');
const fs = require('fs');
const converter = require('./converter.js');
const func = require('./functions.js');

const API_LIMIT = 25;
const API_TIMEOUT = 60;
const DEBUG = false;

var apiCount = API_LIMIT;
var apiMultiplier = 0;

/**
 * 
 * @param {Object} myJSON - The JSON containing the transcript.
 * @param {boolean} getSRT - Whether to get srt files.
 */
function APItranscript(myJSON, getSRT = true) {
    return new Promise((resolve, reject) => {

        var videoList = [];

        // Create output directory if it doesn't exist
        if (!fs.existsSync("./output/transcript")) {
            try {
                fs.mkdirSync("./output/transcript");
            } catch (err) {
                console.log(err);
            }
        }

        myJSON.modules.forEach((element, index) => {

            // Output transcript based on folder
            var courseIndex = ++index;
            var folderName = "./output/transcript/";

            // Generate folder name.
            folderName = folderName.concat(func.numString(courseIndex));

            folderName = folderName + " - " + element.title.replace(/\//g, "-").replace(/\\/g, "-");

            // Generate folder
            if (!fs.existsSync(folderName)) {
                try {
                    fs.mkdirSync(folderName);
                } catch (err) {
                    console.log(err.message);
                }
            }

            // Output the transcript file.
            element.clips.forEach(async (item, index) => {
                // Generate file name
                var fileName = folderName.concat("/");

                // Check for course index
                fileName = fileName.concat(func.numString(courseIndex) + ".");

                // Check for class index
                if (index < 10) {
                    fileName = fileName.concat("0" + index);
                } else {
                    fileName = fileName.concat(index);
                }

                fileName = fileName.concat(" - " + item.title.replace(/\//g, "-").replace(/\\/g, "-") + ".srt");
                fileName = fileName.replace("?", "").replace(":", " - ");

                videoList.push(fileName.replace(".srt", ".mp4"));

                var transcript = "";

                await item.segments.forEach((segment) => {

                    const text = "[00:" + Math.abs(segment.displayTime) + "] " + segment.text + "\n";
                    transcript += text;
                });

                if (DEBUG) {
                    fs.appendFile(fileName + ".debug", transcript, (err) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                }

                if (getSRT) {
                    if (apiCount <= 0) {
                        apiCount = API_LIMIT;
                        apiMultiplier++;
                        console.log("API limit reached, timeout of " + (apiMultiplier * API_TIMEOUT) + "seconds set.");
                    }

                    setTimeout(() => {
                        converter.lrcToSRT(transcript.replace(/"/g, "\\" + "\"").replace(/'/g, "\\" + "\'")).then((srt) => {
                            try {
                                fs.writeFileSync(fileName, srt);
                                console.log("Completed output for " + fileName);
                            } catch (err) {
                                console.log(err);
                            }
                        });
                    }, apiMultiplier * API_TIMEOUT * 1000);

                    apiCount--;
                } else {
                    console.log("Transcript generation ignored for " + fileName);
                }
            });

        });

        resolve(videoList);
    });
}

function localTranscript(myJSON, getSRT = true) {
    return new Promise((resolve, reject) => {

        var videoList = [];

        // Create output directory if it doesn't exist
        if (!fs.existsSync("./output/transcript")) {
            try {
                fs.mkdirSync("./output/transcript");
            } catch (err) {
                console.log(err);
            }
        }

        myJSON.modules.forEach((element, index) => {

            // Output transcript based on folder
            var courseIndex = ++index;
            var folderName = "./output/transcript/";

            // Generate folder name.
            folderName = folderName.concat(func.numString(courseIndex));

            folderName = folderName + " - " + element.title.replace(/\//g, "-").replace(/\\/g, "-").replace(/\?/g, "").replace(/\:/g, " - ").replace(/\®/g, "");

            // Generate folder
            if (!fs.existsSync(folderName)) {
                try {
                    fs.mkdirSync(folderName);
                } catch (err) {
                    console.log(err.message);
                }
            }

            // Output the transcript file.
            element.clips.forEach(async (item, index) => {
                // Generate file name
                var fileName = folderName.concat("/");

                // Check for course index
                fileName = fileName.concat(func.numString(courseIndex) + ".");

                // Check for class index
                fileName = fileName.concat(func.numString(index));

                fileName = fileName.concat(" - " + item.title.replace(/\//g, "-").replace(/\\/g, "-") + ".srt");
                fileName = fileName.replace(/\?/g, "").replace(/\:/g, "- ").replace(/\®/g, "");

                videoList.push(fileName.replace(".srt", ".mp4"));

                // Converts object file to srt, the outputs it.
                converter.transcriptToArr(item).then(transcript => {
                    converter.objToSRT(transcript).then((srt) => {
                    if (getSRT) {
                        // console.log(transcript);
                        fs.writeFileSync(fileName, srt);
                    } else {
                        console.log("Transcript generation ignored for " + fileName);

                    }
                });
                }) 

            });

        });

        resolve(videoList);
    });
}


/**
 * @param {Object} jsonFile - Pass the HAR file in JSON format.
 * @param {boolean} getSRT - Whether to get the SRT files.
 */
module.exports.API = (jsonFile, getSRT = true) => {
    return new Promise((resolve, reject) => {
        try {
            APItranscript(jsonFile, getSRT).then((videoList) => {
                resolve(videoList);
            });

        } catch (err) {
            console.log(err);
            resolve(false);
        }
    })
}


module.exports.local = (jsonFile, getSRT = true) => {
    return new Promise((resolve, reject) => {
        try {
            localTranscript(jsonFile, getSRT).then((videoList) => {
                resolve(videoList);
            });

        } catch (err) {
            console.log(err);
            resolve(false);
        }
    })
}