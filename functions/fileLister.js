const fs = require('fs');
const converter = require('./converter.js');
const func = require('./functions.js');

/**
 * Sanitizes file name in accordance to the windows filesytem format.
 * @param {string} fileName Filename to be sanitized.
 * @return {string}
 */
function fileNameSanitizer(fileName) {
    if (fileName.endsWith(".") || fileName.endsWith("\s")) {
        fileName = fileName.substring(0, fileName.length - 1);
    }

    return fileName
        .replace(/I\.T/g, "IT")
        .replace(/A\.I/g, "AI")
        .replace(/\"/g, "\'")
        .replace(/\?/g, "")
        .replace(/\:/g, "-")
        .replace(/\®/g, "")
        .replace(/\//g, "-")
        .replace(/\\/g, "");
}

function generatePaths(courseInfo) {
    return new Promise(async (resolve, reject) => {
        var videoList = [];
        await courseInfo.modules.forEach((module, index) => {
            // Output transcript based on folder
            var courseIndex = ++index;
            var folderName = ".\/output\/" + fileNameSanitizer(courseInfo.title).trimRight() + "\/";

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
            folderName += func.key;

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

/**
 * 
 * @param {string} sourceText Source of the text to be altered.
 * @param {string} key Key to replace.
 * @param {string} extension Text to place after the generated text. ".mp4" for videos, ".vtt" for subtitles.
 */
module.exports.replaceForPrimaries = (sourceText, key, extension) => {
    return sourceText.replace(key, "").concat(extension);
}