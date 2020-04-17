/**
 * Outputs video links as array
 * @param {Object} linkJSON - JSON containing all video links.
 * @param {boolean} extractAll - Whether to output all possible URLs
 */
function getURLs(linkJSON, extractAll = false) {
    const searchString = /https:\/\/app.pluralsight.com\/video\/clips\/v3\/viewclip.*/;
    var URLs = [];
    linkJSON.log.entries.forEach((element, index) => {
        if (searchString.test(element.request.url)) {
            const passedJSON = JSON.parse(element.response.content.text);
            
            if (!extractAll) {
                URLs.push(passedJSON.urls[0].url);
            } else {
                console.log("Extracting all URLs.");
                passedJSON.urls.forEach((element, index) => {
                    text += URLs.push(passedJSON.urls[index].url);;
                })
            }

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
