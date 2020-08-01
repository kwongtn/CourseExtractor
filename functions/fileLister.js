const fs = require('fs');
const converter = require('./converter.js');
const func = require('./functions.js');

function fileNameSanitizer(fileName) {
    return fileName
        .replace(/\?/g, "")
        .replace(/\:/g, "-")
        .replace(/\®/g, "")
        .replace(/\//g, "")
        .replace(/\\/g, "");
}

function generatePaths(courseInfo) {
    return new Promise(async (resolve, reject) => {
        var videoList = [];
        await courseInfo.modules.forEach((module, index) => {
            // Output transcript based on folder
            var courseIndex = ++index;
            var folderName = ".\/output\/" + fileNameSanitizer(courseInfo.title) + "\/";

            // Create course output directory if it doesn't exist
            if (!fs.existsSync(folderName)) {
                try {
                    fs.mkdirSync(folderName.slice(0, -1));
                } catch (err) {
                    console.log(err);
                }
            }

            // Generate subfolder name.
            folderName = folderName.concat(func.numString(courseIndex));
            folderName = folderName + " - " + fileNameSanitizer(module.title);

            // Generate subfolder
            if (!fs.existsSync(folderName)) {
                try {
                    fs.mkdirSync(folderName);
                } catch (err) {
                    console.log(err.message);
                }
            }

            // Add key to folder name.
            folderName += "11B42C394C6217C5135BF7E4AC23E";

            module.clips.forEach((clip, fileIndex) => {
                // Generate file name
                var fileName = folderName + "\/";

                // Append course index
                fileName += func.numString(courseIndex) + ".";

                // Check for class index
                fileName += func.numString(fileIndex) + " - ";

                fileName += fileNameSanitizer(clip.title);

                videoList.push(fileName);

            });

        });

        resolve(videoList);
    });
}

/**
 * Generates output path and writes into videoList.json
 * @param {Object} courseInfo 
 */
module.exports.generatePaths = (courseInfo) => {
    return new Promise(async (resolve, reject) => {
        generatePaths(courseInfo).then((videoList) => {
            fs.writeFileSync("./output/videoList.json", JSON.stringify(videoList, null, 2));
            resolve(videoList);
        });

    });
}
