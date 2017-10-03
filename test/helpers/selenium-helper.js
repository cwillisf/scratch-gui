jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000; // eslint-disable-line no-undef

import bindAll from 'lodash.bindall';
import 'chromedriver'; // register path
import path from 'path';
import webdriver from 'selenium-webdriver';
import url from 'url';

const {By, until} = webdriver;

class SeleniumHelper {
    constructor () {
        bindAll(this, [
            'clickText',
            'clickButton',
            'clickXpath',
            'findByXpath',
            'getDriver',
            'makeDriverURL',
            'getLogs'
        ]);

        this._baseURL = process.env.SCRATCH_TEST_BASE_URL || `file://${process.cwd()}`;
    }

    getDriver () {
        this.driver = new webdriver.Builder()
            .forBrowser('chrome')
            .build();
        return this.driver;
    }

    findByXpath (xpath) {
        return this.driver.wait(until.elementLocated(By.xpath(xpath), 5 * 1000));
    }

    clickXpath (xpath) {
        return this.findByXpath(xpath).then(el => el.click());
    }

    clickText (text) {
        return this.clickXpath(`//body//*[contains(text(), '${text}')]`);
    }

    clickButton (text) {
        return this.clickXpath(`//button[contains(text(), '${text}')]`);
    }

    /**
     * @param {string} relativePath - the file path relative to this project's base directory.
     * @returns {string} - a URL for `driver.get()`, possibly based on the environment variable SCRATCH_TEST_BASE_URL.
     * @example
     * // Suppose SCRATCH_TEST_BASE_URL is set to 'file://c:/scratch-gui'
     * getDriverURL('build/player.html'); // returns 'file://c:/scratch-gui/build/player.html'
     */
    makeDriverURL (relativePath) {
        const result = url.parse(this._baseURL);
        console.log(`1pathname = ${result.pathname}`);
        result.pathname = path.join(result.pathname, relativePath);
        console.log(`2pathname = ${result.pathname}`);
        console.log(`{${url.format(result)}}`);
        return url.format(result);
    }

    getLogs (whitelist) {
        return this.driver.manage()
            .logs()
            .get('browser')
            .then(entries => entries.filter(entry => {
                const message = entry.message;
                for (let i = 0; i < whitelist.length; i++) {
                    if (message.indexOf(whitelist[i]) !== -1) {
                        // eslint-disable-next-line no-console
                        console.warn(`Ignoring whitelisted error: ${whitelist[i]}`);
                        return false;
                    } else if (entry.level !== 'SEVERE') {
                        // eslint-disable-next-line no-console
                        console.warn(`Ignoring non-SEVERE entry: ${message}`);
                        return false;
                    }
                }
                return true;
            }));
    }
}

export default SeleniumHelper;
