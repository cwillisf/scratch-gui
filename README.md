# scratch-gui
#### Scratch GUI is a set of React components that comprise the interface for creating and running Scratch 3.0 projects

[![Build Status](https://travis-ci.com/LLK/scratch-gui.svg?token=Yfq2ryN1BwaxDME69Lnc&branch=master)](https://travis-ci.com/LLK/scratch-gui)
[![Greenkeeper badge](https://badges.greenkeeper.io/LLK/scratch-gui.svg)](https://greenkeeper.io/)

## Installation
This requires you to have Git and Node.js installed.

In your own node environment/application:
```bash
npm install https://github.com/LLK/scratch-gui.git
```
If you want to edit/play yourself:
```bash
git clone git@github.com:LLK/scratch-gui.git
cd scratch-gui
npm install
```

## Getting started
Running the project requires Node.js to be installed.

## Running
Open a Command Prompt or Terminal in the repository and run:
```bash
npm start
```
Then go to [http://localhost:8601/](http://localhost:8601/) - the playground outputs the default GUI component

## Testing
NOTE: If you're a windows user, please run these scripts in Windows `cmd.exe`  instead of Git Bash/MINGW64.

Run linter, unit tests, build, and integration tests.
```bash
npm test
```

Run unit tests in isolation.
```bash
npm run test:unit
```

Run unit tests in watch mode (watches for code changes and continuously runs tests). See [jest cli docs](https://facebook.github.io/jest/docs/en/cli.html#content) for more options.
```bash
npm run test:unit -- --watch
```

Run integration tests in isolation.
```bash
npm run test:integration
```

You may want to review the documentation for [Jest](https://facebook.github.io/jest/docs/en/api.html) and [Enzyme](http://airbnb.io/enzyme/docs/api/) as you write your tests.

### Running integration tests on the Windows Subsystem for Linux

As of this writing, the Windows Subsystem for Linux (WSL, also known as "Ubuntu on Windows") does not support all the features necessary to run our integration tests. It's possible to work around this by installing and configuring some extra software.

Initial setup:
1. Install Java 8: https://www.java.com/download/
2. Install Chrome: https://www.google.com/chrome/browser/desktop/
3. Install ChromeDriver: https://sites.google.com/a/chromium.org/chromedriver/
4. Download the Selenium standalone server: http://www.seleniumhq.org/download/

Running the tests:
1. In Windows, run this command (replacing `VERSION` with the version you downloaded):

   ```java -jar selenium-server-standalone-VERSION.jar```

2. Look for a message like `INFO - Will listen on 4444` and note the number (the default is 4444).
3. In Linux, run this command (replacing `4444` with the port number noted above):

   ```export SELENIUM_REMOTE_URL="http://localhost:4444/wd/hub"```

4. You should now be able to run the integration tests:

   ```npm run test:integration```

Troubleshooting:
- `java.lang.UnsupportedClassVersionError`: you are likely running Java 7. Uninstall Java 7 if you don't need it, or explicitly specify the path to `java.exe` on the command line.
- `Unable to create new service: ChromeDriverService`: The Chrome web driver, `chromedriver.exe`, is probably not on your `PATH`. There are two ways to fix this:
  - Add `chromedriver.exe` to your `PATH`, either by adjusting your `PATH` or by moving the file into a location already on your `PATH`.
  - Tell Selenium how to find `chromedriver.exe`:
  
    ```
    java -Dwebdriver.chrome.driver="/opt/chromium-browser/chromedriver" -jar selenium-server-standalone-VERSION.jar
    ```

## Publishing to GitHub Pages

You can publish the GUI to github.io so that others on the Internet can view it.
[Read the wiki for a step-by-step guide.](https://github.com/LLK/scratch-gui/wiki/Publishing-to-GitHub-Pages)

## Donate
We provide [Scratch](https://scratch.mit.edu) free of charge, and want to keep it that way! Please consider making a [donation](https://secure.donationpay.org/scratchfoundation/) to support our continued engineering, design, community, and resource development efforts. Donations of any size are appreciated. Thank you!
