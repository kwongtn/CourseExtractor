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

        transcript.modules.forEach((element, index) => {
            // Output transcript based on folder
            var courseIndex = ++index;
            var folderName = "./transcriptOutput/";

            // Generate folder name.
            if(courseIndex < 10){
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
                if (courseIndex < 10){
                    fileName = fileName.concat("0" + courseIndex + "." );
                } else {
                    fileName = fileName.concat(courseIndex + "." );
                }

                // Check for class index
                if (index < 10){
                    fileName = fileName.concat("0" + index);
                } else {
                    fileName = fileName.concat(index);
                }

                fileName = fileName.concat(" - " + item.title.replace(/\//g, "-").replace(/\\/g, "-") + ".srt");
                fileName = fileName.replace("?", "").replace(":", " - ");

                var transcript = "";

                await item.segments.forEach((segment) => {

                    const text = "[00:" + Math.abs(segment.displayTime) + "] " + segment.text + "\n";
                    transcript += text;
                });

                if (DEBUG) {
                    fs.appendFile(fileName + ".debug", transcript, (err) => {
                        if (err) {
                            console.log(err.message);
                        }
                    });
                }

                converter.convert(transcript.replace(/"/g, "\\" + "\"").replace(/'/g, "\\" + "\'")).then((srt) => {
                    try {
                        fs.writeFileSync(fileName, srt);
                        console.log("Completed output for " + fileName);
                    } catch (err) {
                        console.log(err.message);
                    }
                });




            });



        });
    }
});


