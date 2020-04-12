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
                folderName = folderName.concat(courseIndex);
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
                    fileName = fileName.concat(courseIndex + "." );
                    fileName = fileName.concat(index);
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
            });



        });
    }
});


