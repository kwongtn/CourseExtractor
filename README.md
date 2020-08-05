# CourseExtractor
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![HitCount](http://hits.dwyl.com/kwongtn/CourseExtractor.svg)](http://hits.dwyl.com/kwongtn/CourseExtractor)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/kwongtn/CourseExtractor/issues)

[![GitHub license](https://img.shields.io/badge/license-GPLv3-blue.svg)](https://raw.githubusercontent.com/kwongtn/CourseExtractor/LICENSE.MIT)
[![GitHub Releases](https://img.shields.io/github/release/kwongtn/CourseExtractor.svg)](https://github.com/kwongtn/CourseExtractor/releases)

[![GitHub Issues](https://img.shields.io/github/issues/kwongtn/CourseExtractor.svg)](http://github.com/kwongtn/CourseExtractor/issues)

[![Average time to resolve an issue](http://isitmaintained.com/badge/resolution/kwongtn/CourseExtractor.svg)](http://isitmaintained.com/project/kwongtn/CourseExtractor "Average time to resolve an issue")
[![Percentage of issues still open](http://isitmaintained.com/badge/open/kwongtn/CourseExtractor.svg)](http://isitmaintained.com/project/kwongtn/CourseExtractor "Percentage of issues still open")

This project is a proof of concept, however if you found this tool useful, why not  
[![Buy me a coffee via PayPal?](https://img.shields.io/badge/-Buy%20me%20a%20coffee%20via%20PayPal%3F-blue)](https://www.paypal.me/kwongtn)
or [![Buy me a coffee via Grab?](https://img.shields.io/badge/-Buy%20me%20a%20coffee%20via%20Grab%3F-brightgreen)](https://grab.onelink.me/2695613898?af_dp=grab%3A%2F%2Fopen%3FscreenType%3DTRANSFER%26method%3DQRCode%26pairingInfo%3DGPTransfere7564680797b4e32b1f2bb9ac17aa4cb)

# How to use
## Prerequisites
1. Google Chrome (or any other browser that can output HAL files)
1. NodeJS
1. cURL (For video downloads)
1. (Good to have) The [save as file extension](https://chrome.google.com/webstore/detail/save-as-file/iajmdojjjiapknggfnckblngginmjnbe) if you are mass downloading, as you can directly paste the link into the extension without needing to open a new tab.

# Notes
We need to be more careful on using the new method. By only using it when absolutely necessary.   
Due to the ease of getting the content, it got me thinking that PluralSight did this to benefit those that are not so fortunate, by providing them an alternative to view the courses.  
If we abuse this, PluralSight might patch this bug (or not bug) for good.  
Therefore, I urge everyone to use the new method wisely.

## Brief (Old Method)
### Getting course information
1. Log in to your PluralSight account and navigate to your desired course.
1. Open Google Chrome's Developer Tools. (Pressing F12 is a god way to do so.)
1. Navigate to the "network" tab and:
    - Check `preserve log` and `disable cache`.
    - Clear the current captured data.
1. In the course page, refresh the page with the description. You should see stuff going in Developer Tools network tab. You have now captured data for course information output.
1. You may now export the HAL file and close the Developer Tool window.
1. Run the program with the following command: 
    ```
    node ./main.js path_to_HAL_file
    ```
1. The outputs should be in the `./output` directory.

### Getting videos (Old method, or for non-public videos)
\* You may need to be a little quick on this.  
1. Continuing from previous section (Getting Course Information), click on the first video in the course. A new tab should open.  
1. Open Google Chrome's Developer Tools in the new tab and navigate to the network tab. 
1. In the filter box, type in `viewclip`. There should be 1 result.
1. Clear the log and refresh the page.
1. Once the `viewclip` request completes, you may click on the next video and so on, until the `viewclip` files of all video has been loaded.
1. You may now export the HAL file and close the Developer Tool window.
1. Run the program with the following command:
    ```
    node ./main.js path_to_HAL_file
    ```
    or, if you want to download the videos together too, you can run the following:
    ```
    node ./main.js --videoDownload path_to_HAL_file
    ```
1. An output of all the video URLs will be in the `./output/URLs.json` file, and if you specified the `--videoDownload` parameter, videos will be downloaded alongside the subtitle files.
1. <strike> Copy the links and paste into any downloader (or browser window) to download the videos. Do note that you would need to manually rename the files.</strike>

## Brief (New Method)
1. Log in to your PluralSight account and navigate to your desired course.
1. Open Google Chrome's Developer Tools. (Pressing F12 is a god way to do so.)
1. Navigate to the "network" tab and:
    - Check `preserve log` and `disable cache`.
    - Clear the current captured data.
1. In the course page, refresh the page with the description. You should see stuff going in Developer Tools network tab. You have now captured data for course information output.
1. You may now export the HAL file and close the Developer Tool window.
1. To generate video URLs and course information, run the program with the following command: 
    ```
    node ./main.js --new path_to_HAL_file
    ```
1. Or, if you want to download the videos together, run the program with the following command:
    ```
    node ./main.js --new --videoDownload path_to_HAL_file
    ```
1. The outputs should be in the `./output` directory.

## Parameters
```
Usage: node ./main.js [params] path_to_HAL_file

        --help                  Displays this help message.
        --license               Outputs the license of this project. (GNU General Public License)
        --new                   [TESTERS REQUIRED] Uses the new "CourseInfo-Only" methodology to facilitate for full course downloads. Not recommended for large courses.
        --noSubs                Disables output of subtitles.
        --noInfo                Disables output of course information.
        --noBB                  Disables output of BB code.
        --videoDownload         Downloads video using filenames as specified in './output/videoList.json'
        --noSizeCheck           Disables array size checking for video download. Filenames will be taken sequentially.
        --noURL                 Disables output of video URLs.

```

# FAQ
1. Why this project?\
    Just for fun and also to test my NodeJS and programming skills. <strike>Aaand also because that PluralSight's courses are so good I want to download them for viewing later on.</strike>

1. Are you sure this project is just for fun?\
    Since you're asking, no. Not really. Its also a way to raise awareness on client-server security and how easily (given the right time, skills and tools) it is to scrape a website, even though it is behind a paywall.  
    So apparently I've been caught testing this script out and according to the customer support representative:
    ```
    Some things to check to make sure this doesn't happen again are: make sure you don't click rapidly through videos; make sure you're not signed into multiple devices; and make sure only one person is using this account.
    ```
    So for anyone trying to use this script, please be vigilant. I've currently estimated they rate limit the video link requests to 50+ per set time period. So if there are courses that have many videos (you may check when outputting transcripts), do seperate the video requests to multiple sessions.

1. Why NodeJS?\
    Cause its asynchronous nature and because I hate Python. C++ would be much quicker as it is compiled, but does not have native JSON support so I kinda gave it up.

1. What did I learn from this project?\
    Well to start with are HAL file formats and how much information there is in there. Then NodeJS and Promises.

# Issues
1. <strike>API Problem
    As this repo is using an external service to do conversions for srt files, it limits us as the following:
    - 30 API calls per minute,
    - 50 API calls per 5 minutes, and
    - 100 API calls per hour.
    I will be putting in a direct converter, so that conversions can be done without having to rely on an external API. </strike>
    Completed coding the in-house converter.

1. It is currently not possible to put `courseInfo` and `transcript` together with `videoLinks`. It will be investigated later on.

# License
<img align="right" src="http://opensource.org/trademarks/opensource/OSI-Approved-License-100x137.png">

Copyright &copy; 2020 kwongtn

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.
You should have received a copy of the GNU General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.