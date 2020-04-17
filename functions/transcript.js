const https = require('https');
const fs = require('fs');
const converter = require('./converter');

const DEBUG = false;

/**
 * 
 * @param {Object} myJSON - The JSON containing the transcript.
 * @param {boolean} getSRT - Whether to get srt files.
 */
function transcript(myJSON, getSRT = true) {
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
            if (courseIndex < 10) {
                folderName = folderName.concat("0" + courseIndex);
            } else {
                folderName = folderName.concat(courseIndex);
            }
            
            folderName = folderName + " - " + element.title;
            
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
                if (courseIndex < 10) {
                    fileName = fileName.concat("0" + courseIndex + ".");
                } else {
                    fileName = fileName.concat(courseIndex + ".");
                }
                
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
                    converter.convert(transcript.replace(/"/g, "\\" + "\"").replace(/'/g, "\\" + "\'")).then((srt) => {
                        try {
                            fs.writeFileSync(fileName, srt);
                            console.log("Completed output for " + fileName);
                        } catch (err) {
                            console.log(err);
                        }
                    });
                } else {
                    console.log("Transcript generation ignored for " + fileName);
                }
            });
            
        });

        resolve(videoList);
    });
}


/**
 * @param {Object} jsonFile - Pass the HAR file in JSON format.
 * @param {boolean} getSRT - Whether to get the SRT files.
 */
module.exports.generateTranscript = async (jsonFile, getSRT = true) => {
    return new Promise((resolve, reject) => {
        try {
            transcript(jsonFile, getSRT).then((videoList) => {
                resolve(videoList);
            });
    
        } catch (err) {
            console.log(err);
            resolve(false);
        }
    })
}
