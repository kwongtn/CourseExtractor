const fs = require('fs');

const notLast = [
    "--noSubs", "--noInfo", "--noBB", "--noURL"
]

/**
 * Parses the array and returns JSON object containing parameter details.
 * @param {array} params - An array of passed system parameters
 */
function paramsProcess(params) {
    var keys = {
        "path": params[params.length - 1],
        "noSubs": false,
        "noInfo": false,
        "noBB": false,
        "noURL": false,
        "videoDownload": false
    };

    params.forEach((value, index) => {
        switch (value) {
            case "--help": {
                helpText();
                break;
            }

            case "--license": {
                console.log(fs.readFileSync("./LICENSE", "utf-8"));
                process.exit();
                break;
            }

            case "--noSubs": {
                keys.noSubs = true;
                break;
            }

            case "--noInfo": {
                keys.noInfo = true;
                break;
            }

            case "--noBB": {
                keys.noBB = true;
                break;
            }

            case "--videoDownload": {
                keys.videoDownload = true;
                break;
            }

            case "--noURL": {
                keys.noURL = true;
                break;
            }

            default:
                break;
        }
    });
    return keys;
}

/**
 * Outputs the help text containing all parameters, then exit.
 */
function helpText() {
    console.log(
        "\nUsage: node ./main.js [params] path_to_HAL_file\n\n",
        "\t--help\t\t\tDisplays this help message.\n",
        "\t--license\t\tOutputs the license of this project. (GNU General Public License)\n",
        "\t--noSubs\t\tDisables output of subtitles.\n",
        "\t--noInfo\t\tDisables output of course information.\n",
        "\t--noBB\t\t\tDisables output of BB code.\n",
        "\t--videoDownload\t\tDownloads video using filenames as specified in \'./output/videoList.json\'\n",
        "\t--noURL\t\tDisables output of video URLs.\n\n",
        "\rProudly presented to you by flyingdragon of BlackPearl. Licensed under the GNU General Public License v3.\n",
        "\rPRs welcome at https://github.com/kwongtn/CourseExtractor \n\n",
        "\rIf there are any issues, please open an issue at https://github.com/kwongtn/CourseExtractor/issues .",
        "\n\n"
    );
    process.exit();
}

/**
if (process.argv.length < 3) {
    helpText();
    process.exit();
} else {
    notLast.forEach((value, index) => {
        if (process.argv[process.argv.length - 1] == value) {
            helpText();
            process.exit();
        }

    });

    console.log(paramsProcess(process.argv));
}
*/

/**
 * @param {array} params
 */
module.exports.parse = (params) => {
    if (params.length < 3) {
        helpText();

    } else {
        notLast.forEach((value, index) => {
            if (params[params.length - 1] == value) {
                helpText();
            }
    
        });
        return paramsProcess(params);
    }

}