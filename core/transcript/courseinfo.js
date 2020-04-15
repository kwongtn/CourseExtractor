const fs = require('fs');

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
function authorList(courseInfo, linebreak = true){
    var list = "";
    courseInfo.authors.forEach((author, index) => {
        if (index == 0) {
            list += author.displayName;
        } else {
            list += ", " + author.displayName;
        }
    });
    if(linebreak){
        list += "\n";
    }

    return list;
}

/**
 * 
 * @param {array} authors 
 * @param {boolean} header
 */
function authorDetails(authors, header = false){
    var text = "";
    if (header){
        text += "Author Information\n";
    }
    authors.forEach((author, index) => {
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
function heading(courseInfo, company = true, linebreak = true){
    var text = "";
    if (company){
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
                    moduleList += "│\n"
                }
            } else {
                moduleList += "│ ├ " + clip.title + "\n";
            }
        });
    });
    return moduleList;
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
function skillPathInfo(skillPaths, header = false){
    var text = "";
    if (header) {
        text += "Skillpath Information\n";
    }
    skillPaths.forEach((skillPath, index) => {
        text += "- " + skillPath.title + "\n";
    });

    return text;
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

        const returnList = {
            "text": text,
            "courseInfo": courseInfo
        };

        resolve(returnList);

        reject("Error");
    });
}
        }
    });

});


try {
    fs.writeFileSync("./courseInfo" + courseInfo.id + ".txt", text);
    console.log("Completed course output for " + courseInfo.id);
} catch (err) {
    console.log(err.message);
}