const https = require('https');
const func = require("./functions");
const filelister = require("./fileLister.js");
const fs = require("fs");

/**
 * 
 * @param {array} entries 
 */
function getClipID(entries) {
    return new Promise((resolve) => {
        entries.forEach((entry) => {
            const searchString = /https:\/\/vid.pluralsight.com\/clips\/resolution\/.*/;

            if (searchString.test(entry.url)) {
                var returnURL = entry.url.replace(/https:\/\/vid.pluralsight.com\/clips\/resolution\//g, "");
                returnURL = returnURL.replace(/\/current\/mp4\/.*/g, "");
                console.log(returnURL);
                resolve(returnURL);
            }
        });
    })
}

/**
 * Outputs video links as array, together with stuff for subtitles.
 * @param {Object} linkJSON - JSON containing all video links.
 * @param {boolean} extractAll - Whether to output all possible URLs
 */
function getURLs(linkJSON, extractAll = false) {
    const searchString = /https:\/\/app.pluralsight.com\/video\/clips\/v3\/viewclip.*/;
    var URLs = [];
    var history = [];
    linkJSON.log.entries.forEach(async (element, index) => {
        try {
            if (searchString.test(element.request.url)) {
                const passedJSON = JSON.parse(element.response.content.text);
                if (!extractAll) {
                    var myJSON = {};
                    const videoID = await getClipID(passedJSON.urls);

                    myJSON.url = passedJSON.urls[0].url;
                    myJSON.version = passedJSON.version;
                    myJSON.sessionID = passedJSON.sessionId;
                    myJSON.videoID = videoID;

                    if (!history.includes(myJSON.url)) {
                        history.push(myJSON.url);
                        URLs.push(myJSON);

                    }

                } else {
                    console.log("Extracting all URLs.");
                    passedJSON.urls.forEach((urlGroup, index) => {
                        URLs.push(urlGroup.url);
                    });
                }

            }
        } catch (err) {
            console.log(err.message);
            console.log("If you are seeing this, it means that your HAL file was not complete with the video links.");
        }
    });

    return URLs;
}

/**
 * @param {Object} linkJSON - JSON containing all video links.
 */
module.exports.urls = (videoJSON) => {
    return new Promise((resolve, reject) => {
        resolve(getURLs(videoJSON));
    })
}

/**
 * Generate the pluralsight videoclip request URL
 * @param {string} clipID ID of the current focused clip.
 * @param {string} moduleTitle Title of the current module. Used for console output.
 * @param {string} clipTitle Title of the current clip. Used for console output.
 */
function newGetURL(clipID, moduleTitle, clipTitle, moduleIndex, clipIndex, totalClipIndex) {
    return new Promise((resolve, reject) => {
        var options = {
            'method': 'POST',
            'hostname': 'app.pluralsight.com',
            'path': '/video/clips/v3/viewclip',
            'headers': {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4214.3 Safari/537.36',
                'content-type': 'application/json',
                'Accept': '*/*',
            },
            'maxRedirects': 20
        };

        var req = https.request(options, function (res) {
            var chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function (chunk) {
                var body = Buffer.concat(chunks);
                myRes = JSON.parse(body.toString());

                if (myRes.hasOwnProperty("success") && !myRes.success) {
                    console.log(myRes);
                    reject(myRes.error.message);
                } else {
                    console.log(
                        "VIDEOURL: Obtained =>" +
                        "[" + totalClipIndex + "] - " +
                        "[" + moduleIndex + "] " +
                        moduleTitle +
                        ":" +
                        " [" + clipIndex + "] " +
                        clipTitle);
                    const returnValue = {
                        "url": myRes.urls[0].url,
                        "clipID": clipID,
                        "ver": myRes.version
                    }
                    resolve(returnValue);
                }
            });

            res.on("error", function (error) {
                console.error(error);
                reject(error.message);
            });
        });

        var postData = JSON.stringify(
            {
                "clipId": clipID,
                "mediaType": "mp4",
                "quality": "1280x720",
                "online": true,
                "boundedContext": "course",
                "versionId": ""
            });

        req.write(postData);

        req.end();

    });
}

/**
 * Generate an array of pluralsight video URL with respect to the sequence.
 * @param {Object} courseInfo The JSON containing course information.
 */
module.exports.newURL = (courseInfo) => {
    return new Promise((resolve, reject) => {
        var moduleIndex = -1;
        var clipIndex = 0;
        var totalClipIndex = 0;

        let videoURLs = [];
        func.one_by_one(courseInfo.modules, (module) => {
            moduleIndex++;
            clipIndex = 0;

            return func.one_by_one(module.clips, (clip) => {
                return newGetURL(clip.clipId, module.title, clip.title, moduleIndex, clipIndex++, totalClipIndex++).then((url) => {
                    videoURLs.push(url);
                });
            })
        }).then(() => {
            resolve(videoURLs);

        });

    });
}

/**
 * Download the videos and subtitles to the pre-specified paths.
 * @param {string[]} links Link array of the files to be downloaded.
 * @param {string[]} outputPaths Output paths array of the files to be downloaded.
 * @param {string[]} languages If there are subtitles to be downloaded.
 */
module.exports.download = (links, outputPaths, languages) => {
    links.forEach(async (package, index) => {
        console.log("\n\n=============\nCURL-ing for " + outputPaths[index].replace(func.key, "") + "\n");
        const videoFileName = filelister.replaceForPrimaries(outputPaths[index], func.key, ".mp4");
        func.curl(links[index].url, videoFileName, 5);

        if (languages != []) {
            languages.forEach((language) => {
                const subURL = "https://app.pluralsight.com/transcript/api/v1/caption/webvtt/" + package.clipID + "/" + package.ver + "\/" + language + "\/";
                console.log(subURL);

                let subFileName;
                if (language == "en") {
                    subFileName = filelister.replaceForPrimaries(outputPaths[index], func.key, ".vtt");
                } else {
                    const subOutPath = outputPaths[index].replace(new RegExp(func.key + ".*", "g"), "/otherSubs");
                    if (!fs.existsSync(subOutPath)) {
                        fs.mkdirSync(subOutPath);
                    }
                    subFileName = outputPaths[index].replace(func.key, "/otherSubs") + "_" + language + ".vtt";
                }
                func.curl(subURL, subFileName, 5);

            })
        }

    })
}