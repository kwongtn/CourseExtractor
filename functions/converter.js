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
 * @param {number} num
 * @return {Promise<string>}
 */
module.exports.secsConvert = (num) => {
    return new Promise((resolve, reject) => {
        resolve(secsConvert(num));
    });
}
