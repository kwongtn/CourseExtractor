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
