
function getClipID(entry){
    return new Promise((resolve) => {
        entry.request.headers.forEach((header, index) => {
            if(header.name == "referer"){
                resolve(header.value.replace("https:\/\/app.pluralsight.com\/course\-player\?clipId\=", ""));
            }
        })
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
    var videoIDFound = false;
    linkJSON.log.entries.forEach(async(element, index) => {
        try {
            if (searchString.test(element.request.url)) {
                const passedJSON = JSON.parse(element.response.content.text);
                if (!extractAll) {
                    var myJSON = {};
                    const videoID = await getClipID(element);

                    myJSON.url = passedJSON.urls[0].url;
                    myJSON.version = passedJSON.version;
                    myJSON.sessionID = passedJSON.sessionId;
                    myJSON.videoID = videoID;

                    URLs.push(myJSON);
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
