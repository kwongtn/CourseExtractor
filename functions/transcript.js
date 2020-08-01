const https = require('https');
const fs = require('fs');
const converter = require('./converter.js');
const func = require('./functions.js');


function localTranscript(myJSON, getSRT = false) {
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

            // Add key to folder name.
            folderName += "11B42C394C6217C5135BF7E4AC23E";

            // Output the transcript file.
            element.clips.forEach(async (item, index) => {
                // Generate file name
                var fileName = folderName.concat("/");

                // Check for course index
                fileName = fileName.concat(func.numString(courseIndex) + ".");

                // Check for class index
                fileName = fileName.concat(func.numString(index));

                fileName = fileName.concat(" - " + item.title.replace(/\//g, "-").replace(/\\/g, "-").replace(/\"/g, "\'") + ".srt");
                fileName = fileName.replace(/\?/g, "").replace(/\:/g, "- ").replace(/\®/g, "");

                videoList.push(fileName.replace(".srt", ""));

                // Converts object file to srt, the outputs it.
                converter.transcriptToArr(item).then(transcript => {
                    converter.objToSRT(transcript).then((srt) => {
                        if (getSRT) {
                            // console.log(srt);
                            fs.writeFileSync(fileName, srt);
                        } else {
                            // console.log("Transcript generation ignored for " + fileName);

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
module.exports.local = (jsonFile, getSRT = false) => {
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