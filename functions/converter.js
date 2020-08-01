var https = require('https');
var fs = require('fs');
var func = require('./functions.js');

var qs = require('querystring');

/**
 * Converts seconds to an object file containing string representation of hours, minutes and seconds.
 * @param {number} secs No. of seconds
 */
function secsConvert(secs) {
    var myObject = {
        "hours": 0,
        "minutes": 0,
        "seconds": 0
    };

    while (Math.floor(secs / 3600) > 0) {
        myObject.hours++;
        secs = secs - 3600;
    }

    while (Math.floor(secs / 60) > 0) {
        myObject.minutes++;
        secs = secs - 60;
    }

    myObject.seconds = Math.floor(secs * 1000) / 1000;

    myObject.hours = func.numString(myObject.hours);
    myObject.minutes = func.numString(myObject.minutes);
    myObject.seconds = func.numString(myObject.seconds);
    return myObject;
}

/**
 * Converts object item to SRT string.
 * @param {array} transcript Object containing transcript information.
 */
function objToSRT(transcript) {
    return new Promise((resolve, reject) => {
        var stringBuffer = [];
        // console.log(transcript);
        // Sort the transcripts so that they are in the correct order
        transcript.sort((a, b) => {
            return a.seconds - b.seconds;
        });

        // Outputs the JSON to srt format
        transcript.forEach((value, index) => {
            stringBuffer += index + "\n";
            stringBuffer += value.startTime.hours + ":" + value.startTime.minutes + ":" + value.startTime.seconds.replace(".", ",");
            stringBuffer += " --> ";
            stringBuffer += value.endTime.hours + ":" + value.endTime.minutes + ":" + value.endTime.seconds.replace(".", ",") + "\n";
            stringBuffer += " " + value.text + "\n\n";
        });

        // console.log(stringBuffer);

        resolve(stringBuffer);
    })

}

/**
 * @param {number} num
 * @return {Promise<string>}
 */
module.exports.secsConvert = (num) => {
    return new Promise((resolve, reject) => {
        resolve(secsConvert(num));
    });
}

module.exports.objToSRT = (obj) => {
    // console.log(obj);
    return new Promise((resolve, reject) => {
        resolve(objToSRT(obj));
    })
}

function transcriptToArr(item) {
    return new Promise((resolve, reject) => {
        let transcript = [];
        // Create a transcript object.
        item.segments.forEach((segment, index) => {

            /**
             * @param {Object} startTime Start time of subtitle.
             * @param {Object} endTime End time of subtitle.
             * @param {number} seconds Time of subtitle in seconds.
             * @param {string} text Transcript content.
             */
            var line = {
                "startTime": {},
                "endTime": {},
                "seconds": segment.displayTime,
                "text": segment.text
            };

            const startTimePromise = secsConvert(segment.displayTime);

            // If it is the last subtitle, add 3 seconds to compute its endtime.
            let endTimePromise;
            if ((index + 1) == item.segments.length) {
                endTimePromise = secsConvert(segment.displayTime + 3);
            } else {
                endTimePromise = secsConvert(item.segments[index + 1].displayTime);
            }

            Promise.all([startTimePromise, endTimePromise]).then(promises => {
                line.startTime = promises[0];
                line.endTime = promises[1];
                transcript.push(line);
            });

        });
        resolve(transcript);
    });

}

module.exports.transcriptToArr = (item) => {
    return new Promise((resolve, reject) => {
        resolve(transcriptToArr(item));

    })
}