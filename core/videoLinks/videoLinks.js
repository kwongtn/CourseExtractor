var fs = require('fs');

var myJSON;
const EXTRACT_ALL = false;

try {
    myJSON = JSON.parse(fs.readFileSync("./app.pluralsight.com_video.har"));
} catch (err) {
    console.log(err.message);
}

myJSON.log.entries.forEach((element, index) => {
    if (element.request.url == "https://app.pluralsight.com/video/clips/v3/viewclip") {
        var videoJSON = JSON.parse(element.response.content.text);

        if (!EXTRACT_ALL) {
            // Extract first URL
            console.log(videoJSON.urls[0].url);

        } else {
            // Extract all possible URLs
            videoJSON.urls.forEach((element, index) => {
                console.log(element.url);
            });

        }

    }
});


