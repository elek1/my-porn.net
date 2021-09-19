const express = require('express')
const router = express.Router()
const db = require('../database')
const pug = require('pug')
const puppeteer = require('puppeteer');
var HTMLParser = require('node-html-parser');

router.get('/', async (req, res) => {
    res.send(pug.renderFile('views/import.pug'))
})

router.post('/', async (req, res) => {
})

function getInfo(url) {
    return new Promise(async(resolve, reject) => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
        setTimeout(async () => {
            const json = HTMLParser.parse(await page.content())

            const returnJSON = {
                source: '',
                'source link': url,
                author: [],
                cover: '',
                title: '',
                tags: [],
                pages: []
            }

            switch (url.substr(0, url.indexOf('/', 9))) {
                case 'https://yiffer.xyz':
                    json.querySelector('#comicKeywords').childNodes.forEach(val => returnJSON.tags.push(val.innerHTML.trim()))
        
                    json.querySelector('#comicPageContainer').childNodes.forEach(val => {
                        returnJSON.pages.push({
                            hq: val.getAttribute('src'),
                            lq: val.getAttribute('src')
                        })
                    })

                    returnJSON.source = 'yiffer.xyz'
                    returnJSON.title = json.querySelector('.loadedComicHeader').innerText.trim()
                    returnJSON.author.push(json.querySelector('.artistNameLink').innerText.toLowerCase().trim())
                    returnJSON.cover = 'https://static.yiffer.xyz/comics' + url.substr(url.indexOf('/', 9)) + (url.endsWith('/') ? '' : '/') + 'thumbnail.jpg'

                    break;
                default:
                    reject()
                    return
            }

            resolve(returnJSON)

            await browser.close();
        }, 1000)
    })
}

module.exports = router
