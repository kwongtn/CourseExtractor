/**
 * Outputs video links as array
 * @param {Object} linkJSON - JSON containing all video links.
 * @param {boolean} extractAll - Whether to output all possible URLs
 */
function getURLs(linkJSON, extractAll = false) {
    const searchString = /https:\/\/app.pluralsight.com\/video\/clips\/v3\/viewclip.*/;
    var URLs = [];
    linkJSON.log.entries.forEach((element, index) => {
        try {
            if (searchString.test(element.request.url)) {
                const passedJSON = JSON.parse(element.response.content.text);
                if (!extractAll) {
                    URLs.push(passedJSON.urls[0].url);
                } else {
                    console.log("Extracting all URLs.");
                    passedJSON.urls.forEach((urlGroup, index) => {
                        URLs.push(urlGroup.url);
                    })
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
