const express = require('express')
const app = express()
const port = process.env.PORT || 3000
//const puppeteer = require('puppeteer-extra')
const puppeteer = require('puppeteer');


// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
//const StealthPlugin = require('puppeteer-extra-plugin-stealth')
//puppeteer.use(StealthPlugin())

// Add adblocker plugin to block all ads and trackers (saves bandwidth)
//const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
//puppeteer.use(AdblockerPlugin({ blockTrackers: true }))

let browsers = [];
app.get('/', async (req, res) => {
    let browser = await getOrCreateBrowser();

    res.json({
        browserWSEndpoint: browser.wsEndpoint()
    });
});

const getOrCreateBrowser = async () => {
    console.log('create new browser')
    // @ts-ignore
    let browser = await puppeteer.launch({headless: true, args: ['--no-sandbox']});

    console.log(`Testing the stealth plugin..`);
    const page = (await browser.pages())[0];
    await page.goto('https://bot.sannysoft.com');
    await page.waitForTimeout(5000)
    await page.screenshot({path: 'stealth.png', fullPage: true});

    await page.goto('https://arh.antoinevastel.com/bots/areyouheadless');
    await page.waitForTimeout(1000)
    let headlessText = await page.evaluate(() => {
        let text = '';
        try {
            // @ts-ignore
            text = document.querySelector('#res').innerText;
        } catch (e) {
            console.log(e);
        }

        return text;
    });

    console.log(headlessText);


    browsers.push({browser});

    console.log(browsers.length + ' browsers en cours');

    /*
        const pages = await browser.pages();
        const page = await pages[0];

        console.log(`Testing adblocker plugin..`)
        await page.goto('https://www.vanityfair.com')
        await page.waitForTimeout(1000)
        await page.screenshot({ path: 'adblocker.png', fullPage: true })

        console.log(`Testing the stealth plugin..`)
        await page.goto('https://bot.sannysoft.com')
        await page.waitForTimeout(5000)
        await page.screenshot({ path: 'stealth.png', fullPage: true })
    */

    return browser;
};

app.listen(port, () => console.log(`sample-expressjs app listening on port ${port}!`))
