/**
 * 
 * @param {Object} linkJSON - JSON containing all video links.
 * @param {boolean} extractAll - Whether to output all possible URLs
 */
function getURLs(linkJSON, extractAll = false){
    var text = "";
    if(!extractAll){
        text += linkJSON.urls[0].url;
    } else {
        console.log("Extracting all URLs.");
        linkJSON.urls.forEach((element, index) => {
            text += element.url;
        })
    }

    return text;
}

/**
 * @param {Object} linkJSON - JSON containing all video links.
 */
module.exports.urls = (videoJSON) => {
    return new Promise((resolve, reject) => {
        resolve(getURLs(videoJSON));
    })
}