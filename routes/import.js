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
    
    //res.sendStatus(201) // Success
    //res.sendStatus(500) // Internal Server Error
    //res.sendStatus(400) // Bad Request

    console.log(req.body)

    const comic = await getInfo(req.body.url)
    comic.next = null
    comic.previous = null
    comic.ongoing = req.body.status

    db.addComic(comic)

    res.sendStatus(201)
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
                    returnJSON.author.push(json.querySelector('.artistNameLink').innerText.toLowerCase().trim())  // TODO change to authors
                    //returnJSON.cover = 'https://static.yiffer.xyz/comics' + url.substr(url.indexOf('/', 9)) + (url.endsWith('/') ? '' : '/') + 'thumbnail.jpg'
                    returnJSON.cover = returnJSON.pages[0].lq

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
