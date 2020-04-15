var https = require('https');
var fs = require('fs');

var qs = require('querystring');

var options = {
    'method': 'POST',
    'hostname': 'toolslick.com',
    'path': '/api/process',
    'headers': {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    'maxRedirects': 20
};

/**
 * Converts LRC files to srt via [toolslick.com](toolslick.com)
 * @param {string} bodyText - LRC file as string.
 */
function convert(bodyText) {
    return new Promise((resolve, reject) => {
        var srt = new String();
        var req = https.request(options, function (res) {
            var chunks = [];
    
            res.on("data", function (chunk) {
                chunks.push(chunk);
            });
    
            res.on("end", function (chunk) {
                var body = Buffer.concat(chunks);
                resolve(body.toString());
            });
            
            res.on("error", function (error) {
                reject(error);
            });
        });
        
        
        var postData = qs.stringify({
            'parameters': '{"startCounter":"0","allowDuplicateTimestamp":true,"allowBracketinContent":true,"trailingSubtitleDisplaySeconds":"3","input":\"' + bodyText + "\"}",
            'tool': 'subtitle-lrc-to-srt-converter'
        });
        
        req.write(postData);
        req.end();
    })

}


module.exports.convert = (body) => {
    return new Promise((resolve, reject) => {
        resolve(convert(body));
    });
}