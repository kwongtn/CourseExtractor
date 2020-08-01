const courseInfo = require("./functions/courseinfo.js");
const paramProcessor = require("./functions/paramProcessor.js");
const video = require("./functions/video.js");
const filelister = require("./functions/filelister.js");
const exec = require("child_process").execSync;
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

// Generate video list
if (!params.videoDownload) {
    const searchString = /https:\/\/app\.pluralsight\.com\/learner\/content\/courses.*/;
    var obtainedVideoList = false;
    try {
        myJSON.log.entries.forEach((element, index) => {
            if (!obtainedCourseInfo && searchString.test(element.request.url)) {
                const passedJSON = JSON.parse(element.response.content.text);
                filelister.generatePaths(passedJSON);

                obtainedVideoList = true;
            }
        });
    } catch (err) {
        console.log(err.message);
        console.log("If you see this its probably because the HAR file you provided does not have course info, or that the format has changed.");
        console.log("If you are sure that the format has changed, please attach your HAR file and open an issue here: https://github.com/kwongtn/CourseExtractor/issues");
    }

}

// Generate and write courseInfo to output
if (!params.noInfo) {
    const searchString = /https:\/\/app\.pluralsight\.com\/learner\/content\/courses.*/;
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
    } catch (err) {
        console.log(err.message);
        console.log("If you see this its probably because the HAR file you provided does not have course info, or that the format has changed.");
        console.log("If you are sure that the format has changed, please attach your HAR file and open an issue here: https://github.com/kwongtn/CourseExtractor/issues");
    }

}

// Generate and write course bb code to output
if (!params.noBB) {
    const searchString = /https:\/\/app\.pluralsight\.com\/learner\/content\/courses.*/;
    var obtainedCourseInfoBb = false;
    try {
        myJSON.log.entries.forEach((element, index) => {
            if (!obtainedCourseInfoBb && searchString.test(element.request.url)) {
                const passedJSON = JSON.parse(element.response.content.text);
                courseInfo.courseInfoBbCode(passedJSON).then((output) => {
                    try {
                        fs.writeFileSync("./output/courseBb_" + output.courseInfo.id + ".txt", output.text);
                        console.log("Completed bb text output for " + output.courseInfo.id);
                    } catch (err) {
                        console.log(err);
                    }

                });

                obtainedCourseInfoBb = true;
            }
        });
    } catch (err) {
        console.log(err);
        console.log("If you see this its probably because the HAR file you provided does not have course info, or that the format has changed.");
        console.log("If you are sure that the format has changed, please attach your HAR file and open an issue here: https://github.com/kwongtn/CourseExtractor/issues");
    }
}


// Generate and write video URLs to output
if (!params.noURL) {
    fs.writeFileSync("./output/urls.json", "");

    var URLs = [];

    video.urls(myJSON).then(links => {
        try {
            try {
                fs.appendFileSync("./output/urls.json", JSON.stringify(links, null, 2));
                console.log("Completed url output.");
            } catch (err) {
                console.log(err.message);
            }
        } catch (err) {
            console.log(err.message);
            console.log("If you see this its probably because the HAR file you provided does not have video URLs, or that the format has changed.");
            console.log("If you are sure that the format has changed, please attach your HAR file and open an issue here: https://github.com/kwongtn/CourseExtractor/issues");
        }
    });


}

// Video download
const DOWNLOAD_LIMIT = 5;
const DOWNLOAD_TIMEOUT = 10;
var downloadCount = DOWNLOAD_LIMIT;
var downloadMultiplier = 0;

if (params.videoDownload) {
    console.log("Waiting for 1 sec timeout...");
    setTimeout(() => {
        console.log("Wait complete.");
        const URLs = JSON.parse(fs.readFileSync("./output/urls.json", "utf-8"));
        const fileNames = JSON.parse(fs.readFileSync("./output/videoList.json", "utf-8"));
        const key = "11B42C394C6217C5135BF7E4AC23E";

        let languages;
        if (fs.existsSync("./output/subLanguages.json")) {
            languages = JSON.parse(fs.readFileSync("./output/subLanguages.json", "utf-8"));
        } else {
            languages = ["en"];
        }

        // Options for child_process.spawn section
        const options = {
            "detached": true,
            "shell": true
        }

        if ((URLs.length == fileNames.length) || params.noSizeCheck) {
            if (params.noSizeCheck) {
                console.log("Skipping JSON array size check. Array sizes are: ");
                console.log("URL file\t:" + URLs.length);
                console.log("fileName file\t:" + fileNames.length + "\n");

                if (URLs.length == fileNames.length) {
                    console.log("\nArray sizes same. It is recommended that you turn on array size check to ensure JSON file integrity.");
                }
            } else {
                console.log("JSON files have the same array size of " + URLs.length + ". Proceeding to download.");
            }

            URLs.forEach(async (package, index) => {
                if (downloadCount <= 0) {
                    downloadCount = DOWNLOAD_LIMIT;
                    downloadMultiplier++;
                    // console.log("API limit reached, timeout of " + (downloadMultiplier * DOWNLOAD_TIMEOUT) + "seconds set.");
                }

                setTimeout(() => {
                    console.log("\n\n=============\nCURL-ing for " + fileNames[index].replace(key, "") + "\n");
                    const videoFileName = fileNames[index].replace(key, "") + ".mp4";
                    console.log(videoFileName);
                    exec("curl " + package.url + " -P 5 --output \"" + videoFileName + "\"");

                    if (!params.noSubs) {
                        languages.forEach((language) => {
                            const subURL = "https://app.pluralsight.com/transcript/api/v1/caption/webvtt/" + package.videoID + "/" + package.version + "\/" + language + "\/";
                            console.log(subURL);

                            let subFileName;
                            if (language == "en") {
                                subFileName = fileNames[index].replace(key, "") + ".vtt";
                            } else {
                                if (!fs.existsSync(fileNames[index].replace(/11B42C394C6217C5135BF7E4AC23E.*/g, "/otherSubs"))) {
                                    fs.mkdirSync(fileNames[index].replace(/11B42C394C6217C5135BF7E4AC23E.*/g, "/otherSubs"));
                                }
                                subFileName = fileNames[index].replace(key, "/otherSubs") + "_" + language + ".vtt";
                            }
                            exec("curl " + subURL + " --output \"" + subFileName + "\"");

                        })
                    }
                }, 0);// downloadMultiplier * DOWNLOAD_TIMEOUT * 1000);


                downloadCount--;
            })
        } else {
            console.log("URL length & fileNames length mismatch: \nURL\t\t: " + URLs.length + "\nFilenames\t: " + fileNames.length);
            console.log("Exiting.");
        }
    }, 1000)
}