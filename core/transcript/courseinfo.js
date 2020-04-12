const fs = require('fs');

var courseInfo = fs.readFileSync("./courseinfo.json", "utf-8");
courseInfo = JSON.parse(courseInfo);

var text = "Extracted using the CourseExtractor script by flyingdragon of BlackPearl.\n";
text += "============================================================================\n";
text += "Pluralsight - " + courseInfo.title + " by ";

// Generating authors to put in title
courseInfo.authors.forEach((author, index) => {
    if(index == 0){
        text += author.displayName;
    } else {
        text += ", " + author.displayName;
    }
});
text += "\n";

// Generating course description
text += courseInfo.shortDescription + "\n";
text += courseInfo.description + "\n";
text += "\n";
text += "https://app.pluralsight.com/library/courses/" + courseInfo.id + "\n";
text += "\n";

// Generating course structure
text += courseInfo.title + "\n";

courseInfo.modules.forEach((module, moduleIndex) => {
    text += "├ " + module.title + "\n";
    module.clips.forEach((clip, index) => {
        if((index + 1) == module.clips.length){
            if((moduleIndex + 1) == courseInfo.modules.length){
                text += "└ └ " + clip.title + "\n";    
            } else {
                text += "│ └ " + clip.title + "\n";
                text += "│\n"
            }
        } else {
            text += "│ ├ " + clip.title + "\n";
        }
    });
});

// Generating author information
text += "============================================================================\n";
text += "Author Information\n";
courseInfo.authors.forEach((author, index) => {
    text += author.displayName + "\n";
    text += author.bio + "\n\n";
});

// Generating course skillpath information
text += "============================================================================\n";
text += "Skillpath Information\n";
courseInfo.skillPaths.forEach((skillPath, index) => {
    text += "- " + skillPath.title + "\n";
});

try {
    fs.writeFileSync("./courseInfo" + courseInfo.id + ".txt", text);
    console.log("Completed course output for " + courseInfo.id);
} catch (err) {
    console.log(err.message);
}