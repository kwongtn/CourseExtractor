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
1. (Good to have) The [save as file extension](https://chrome.google.com/webstore/detail/save-as-file/iajmdojjjiapknggfnckblngginmjnbe) if you are mass downloading, as you can directly paste the link into the extension without needing to open a new tab.

## Brief
### Getting course information
1. Log in to your PluralSight account and navigate to your desired course.
1. Open Google Chrome's Developer Tools. (Pressing F12 is a god way to do so.)
1. Navigate to the "network" tab and:
    - Check `preserve log` and `disable cache`.
    - Clear the current captured data.
1. In the course page, refresh the page with the description. You should see stuff going in Developer Tools network tab. You have now caputured data for course information output.
1. Navigate to the course "transcript" page. You have now captured data for transcript output.
1. You may now export the HAL file and close the Developer Tool window.
1. Run the program with the following command: 
    ```
    node ./main.js --noVideo path_to_HAL_file
    ```
    If you did not do the transcripts part, do the following command instead:
    ```
    node ./main.js --noVideo --noSubs path_to_HAL_file
    ```
1. The outputs should be in the `./output` directory.

### Getting videos
\* You may need to be a little quick on this.
1. Continuing from above, click on the first video in the course. A new tab should open.
1. Open Google Chrome's Developer Tools in the new tab and navigate to the network tab. 
1. In the filter box, type in `viewclip`. There should be 1 result.
1. Clear the log and refresh the page.
1. Once the `viewclip` request completes, you may click on the next video and so on, until the `viewclip` files of all video has been loaded.
1. You may now export the HAL file and close the Developer Tool window.
1. Run the program with the following command:
    ```
    node ./main.js --noSubs --noInfo --noBB path_to_HAL_file
    ```
1. An output of all the video URLs will be in the `./output` directory.
1. Copy the links and paste into any downloader (or browser window) to download the videos. Do note that you would need to manually rename the files.


## Parameters
```
Usage: node ./main.js [params] path_to_HAL_file

        --help          Displays this help message.
        --license       Outputs the license of this project. (GNU General Public License)
        --noSubs        Disables output of subtitles.
        --noInfo        Disables output of course information.
        --noBB          Disables output of BB code.
        --noVideo       Disables output of video URLs.
```

# FAQ
1. Why this project?\
    Just for fun and also to test my NodeJS and programming skills. <strike>Aaand also because that PluralSight's courses are so good I want to download them for viewing later on.</strike>

1. Are you sure this project is just for fun?\
    Since you're asking, no. Not really. Its also a way to raise awareness on client-server security and how easily (given the right time, skills and tools) it is to scrape a website, even though it is behind a paywall.

1. Why NodeJS?\
    Cause its asynchronous nature and because I hate Python. C++ would be much quicker as it is compiled, but does not have native JSON support so I kinda gave it up.

1. What did I learn from this project?\
    Well to start with are HAL file formats and how much information there is in there. Then NodeJS and Promises.



# License
<img align="right" src="http://opensource.org/trademarks/opensource/OSI-Approved-License-100x137.png">

Copyright &copy; 2020 kwongtn

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.
You should have received a copy of the GNU General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.