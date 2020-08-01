const fs = require('fs');
const converter = require('./converter.js');

/**
 * 
 * @param {string} pathName - Relative path to the file.
 * @param {string} encoding 
 */
function courseReader(pathName, encoding = 'utf8') {
    return new Promise((resolve, reject) => {
        var courseInfo = fs.readFileSync("./courseinfo.json", "utf-8");
        courseInfo = JSON.parse(courseInfo);

        resolve(courseInfo);
    });
}

/**
 * Returns course URL
 * @param {Object} courseInfo 
 */
function courseURL(courseInfo) {
    return "https://app.pluralsight.com/library/courses/".concat(courseInfo.id + "\n");
}

/**
 * Returns comma seperated author names 
 * @param {Object} courseInfo 
 * @param {boolean} linebreak - Whether to include line break after function completes.
 */
function authorList(courseInfo, linebreak = true) {
    var list = "";
    courseInfo.authors.forEach((author, index) => {
        if (index == 0) {
            list += author.displayName;
        } else {
            list += ", " + author.displayName;
        }
    });
    if (linebreak) {
        list += "\n";
    }

    return list;
}

/**
 * 
 * @param {array} authors 
 * @param {boolean} header
 */
function authorDetails(authors, header = false) {
    var text = "";
    if (header) {
        text += "Author Information\n";
    }
    authors.forEach((author, index) => {
        if (!header) {
            text += "[IMG]" + author.avatar.defaultUrl + "[/IMG]\n"
        }

        text += author.displayName + "\n";
        text += author.bio + "\n\n";
    });
    return text;
}

/**
 * Returns course heading. 
 * * E.g. "Pluralsight - Investigations and Incident Management by Kevin Henry"
 * @param {Object} courseInfo 
 * @param {boolean} company - Whether to include "PluralSight" at the start of the title.
 * @param {boolean} linebreak - Passing value to authorList function.
 */
function heading(courseInfo, company = true, linebreak = true) {
    var text = "";
    if (company) {
        text += "Pluralsight - ";
    }
    text += courseInfo.title + " by " + authorList(courseInfo, linebreak);
    return text;
}

/**
 * Generates course list with format
 * @param {string} courseTitle - Title of course.
 * @param {array} modules - An array of modules / subtopics of the course.
 */
function moduleList(courseTitle, modules) {
    var moduleList = "" + courseTitle + "\n";
    modules.forEach((module, moduleIndex) => {
        moduleList += "├ " + module.title + "\n";
        module.clips.forEach((clip, index) => {
            if ((index + 1) == module.clips.length) {
                if ((moduleIndex + 1) == modules.length) {
                    moduleList += "└ └ " + clip.title + "\n";
                } else {
                    moduleList += "│ └ " + clip.title + "\n";
                    moduleList += "│\n";
                }
            } else {
                moduleList += "│ ├ " + clip.title + "\n";
            }
        });
    });
    return moduleList;
}

/**
 * 
 * @param {string} seconds Course duration string. Should be in format of PT<number>S
 */
function duration(seconds) {
    return new Promise((resolve, reject) => {
        seconds = seconds.replace(/PT/g, "").replace(/S/g, "");
        const num = Number.parseFloat(seconds);

        resolve(converter.secsConvert(num));

    });
}

/**
 * Returns concatenated string of shortDescription, then longDescription.
 * @param {Object} courseInfo 
 */
function courseDesc(courseInfo) {
    return (courseInfo.shortDescription + "\n" + courseInfo.description + "\n");
}

/**
 * 
 * @param {array} skillPaths - Array of skillPaths of the course
 * @param {boolean} header - Whether to include skillpath information header
 */
function skillPathInfo(skillPaths, header = false) {
    var text = "";
    if (header) {
        text += "Skillpath Information\n";
    }
    skillPaths.forEach((skillPath, index) => {
        text += "- " + skillPath.title + "\n";
    });

    if (text == "" || text == "Skillpath Information\n") {
        return text + "None\n";
    } else {
        return text;
    }
}

/**
 * Generates a course info string suitable for output into a text file.
 * @param {Object} courseInfo 
 */
function courseInfoGenerator(courseInfo) {
    return new Promise((resolve, reject) => {

        var text = "Extracted using the CourseExtractor script by flyingdragon of BlackPearl.\n";
        text += "============================================================================\n";

        text += heading(courseInfo);

        // Generating course description
        text += courseDesc(courseInfo);
        text += "\n";
        text += courseURL(courseInfo);
        text += "\n";

        // Generating course structure
        text += moduleList(courseInfo.title, courseInfo.modules);

        // Generating author information
        text += "============================================================================\n";
        text += authorDetails(courseInfo.authors, true);

        // Generating course skillpath information
        text += "============================================================================\n";
        text += skillPathInfo(courseInfo.skillPaths, true);

        // Generating additional course information
        text += "============================================================================\n";
        text += "Published on: " + courseInfo.publishedOn + "\n";
        text += "Last updated: " + courseInfo.updatedOn + "\n";
        text += "Level       : " + courseInfo.level + "\n";
        duration(courseInfo.duration).then((duration) => {
            text += "Duration    : " + duration.hours + " hours " + duration.minutes + " minutes " + duration.seconds + " seconds\n";
            
            const returnList = {
                "text": text,
                "courseInfo": courseInfo
            };

            resolve(returnList);

            reject("Error");
        });


    });
}

/**
 * Generates BB code suitable for posting in BlackPearl.
 * @param {Object} courseInfo - Course info as JSON object.
 */
function courseInfoBbCodeGenerator(courseInfo) {
    var text = "";
    return new Promise((resolve, reject) => {
        text += heading(courseInfo).concat("\n\n");

        // Add course images
        text += "[IMG width=\"500px\"]https://i.imgur.com/Cm7NPR0.png[/IMG]\n";
        text += "[IMG width=\"500px\"]" + courseInfo.courseImageUrl + "[/IMG]\n";
        text += "\n";

        // Add course title
        text += "[B][U]" + heading(courseInfo, false, false) + "[/B][/U]\n\n";

        // Add course description
        text += "[B][U]Course Description[/B][/U]\n";
        text += courseDesc(courseInfo) + "\n";

        // Add course link
        text += "[B][U]Course Link[/B][/U]\n"
        text += courseURL(courseInfo) + "\n";

        // Add course structure
        text += "[B][U]Course Structure[/B][/U]\n[SPOILER=\"Course Structure\"]\n";
        text += moduleList(courseInfo.title, courseInfo.modules);
        text += "[/SPOILER]\n\n";

        // Add author information
        text += "[B][U]Author Information[/B][/U]\n[SPOILER=\"Author Information\"]\n";
        text += authorDetails(courseInfo.authors);
        text += "[/SPOILER]\n\n";

        // Add PuralSight Skillpath information
        text += "[B][U]Skillpath Information[/B][/U]\n";
        text += skillPathInfo(courseInfo.skillPaths, false);
        text += "\n";

        // Generating additional course information
        text += "============================================================================\n";
        text += "[B]Published on: [/B]" + courseInfo.publishedOn + "\n";
        text += "[B]Last updated: [/B]" + courseInfo.updatedOn + "\n";
        text += "[B]Level       : [/B]" + courseInfo.level + "\n";
        duration(courseInfo.duration).then((duration) => {
            text += "[B]Duration    : [/B]" + duration.hours + " hours " + duration.minutes + " minutes " + duration.seconds + " seconds\n\n";

            // Add download link section
            text += "[B][U]Download Link[/B][/U]\n[HIDEREACT=1,2,3,4,5,6]\n[DOWNCLOUD]\n";
            text += "REMEMBER TO INSERT THE LINK HERE!!!!!!!!!!!!\n";
            text += "[/DOWNCLOUD]\n[/HIDEREACT]"

            const returnList = {
                "text": text,
                "courseInfo": courseInfo
            };

            resolve(returnList);

            reject("Error");
        });

    });
}

/**
courseReader("./courseinfo.json").then(courseInfo => {
    // Generate and write courseInfo
    courseInfoGenerator(courseInfo).then(resolved => {
        try {
            fs.writeFileSync("./output/courseInfo_" + resolved.courseInfo.id + ".txt", resolved.text);
            console.log("Completed course output for " + resolved.courseInfo.id);
        } catch (err) {
            console.log(err);
            return false;
        }
        
        return true;
    });
    
    // Generate and write courseInfo bb code. Designed for Blackpearl
    courseInfoBbCodeGenerator(courseInfo).then(resolved => {
        try {
            fs.writeFileSync("./output/courseBb_" + resolved.courseInfo.id + ".txt", resolved.text);
            console.log("Completed bb text output for " + resolved.courseInfo.id);
        } catch (err) {
            console.log(err);
            return false;
        }
        
        return true;
    });

});
*/

/**
 * @param {Object} courseInfo
 */
module.exports.courseInfoTxt = (courseInfo) => {
    return courseInfoGenerator(courseInfo);
}

/**
 * @param {Object} courseInfo
 */
module.exports.courseInfoBbCode = (courseInfo) => {
    return courseInfoBbCodeGenerator(courseInfo);
}