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

        const returnJSON = {
            source: '',
            sourcelink: url,
            author: [],
            cover: '',
            title: '',
            tags: [],
            pages: []
        }

        switch (url.substr(0, url.indexOf('/', 9))) {
            case 'https://yiffer.xyz':
                var browser = await puppeteer.launch();
                var page = await browser.newPage();
                await page.goto(url);

                setTimeout(async () => {
                    const json = HTMLParser.parse(await page.content())
                    await browser.close();

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

                    resolve(returnJSON)
                }, 1000)

                break;
            case 'https://e621.net':
                const args = url.substring(8).split('/')
                if(args[1] != 'pools'){
                    reject()
                    return
                }

                var browser = await puppeteer.launch();
                var page1 = await browser.newPage();
                var page2 = await browser.newPage();

                await page1.goto(`https://e621.net/pools/${args[2]}.json`);
                const poolJSON = JSON.parse(HTMLParser.parse(await page1.content()).querySelector('body').innerText)

                await page2.goto(`https://e621.net/posts.json?tags=pool%3A${args[2]}`);
                const pagesJSON = JSON.parse(HTMLParser.parse(await page2.content()).querySelector('body').innerText)

                returnJSON.source = 'e621'
                returnJSON.title = poolJSON.name.replaceAll('_', ' ')
                returnJSON.cover = pagesJSON.posts[0].sample.url

                pagesJSON.posts.forEach(val => {
                    val.tags.artist.forEach(artist => {
                        artist = artist.replaceAll('_', ' ').toLowerCase().trim()
                        if(!returnJSON.author.includes(artist))
                            returnJSON.author.push(artist)
                    })
                    val.tags.general.forEach(tag => {
                        tag = tag.replaceAll('_', ' ').toLowerCase().trim()
                        if(!returnJSON.tags.includes(tag))
                            returnJSON.tags.push(tag)
                    })
                    val.tags.species.forEach(tag => {
                        tag = tag.replaceAll('_', ' ').toLowerCase().trim()
                        if(!returnJSON.tags.includes(tag))
                            returnJSON.tags.push(tag)
                    })

                    returnJSON.pages[poolJSON.post_ids.indexOf(val.id)] = {
                        hq: val.file.url,
                        lq: val.sample.url
                    }
                })

                resolve(returnJSON)
                
                break;
            case 'https://hdporncomics.com':
                var browser = await puppeteer.launch();
                var page = await browser.newPage();
                await page.goto(url);

                setTimeout(async () => {
                    const json = HTMLParser.parse(await page.content())
                    await browser.close();

                    var scrolls = json.querySelector('div#infoBox')

                    scrolls.childNodes.forEach(scroll => {
                        if(scroll.querySelector('span').innerText.startsWith("Artist")){
                            scroll.querySelector('.scrollTaxonomy').childNodes.forEach(val => {
                                let author = val.innerText.trim().toLowerCase()
                                if(author)
                                    returnJSON.author.push(author) // TODO change to authors
                            })
                        } else if(scroll.querySelector('span').innerText.startsWith("Tags")){
                            scroll.querySelector('.scrollTaxonomy').childNodes.forEach(val => {
                                switch (val.innerText.trim()) {
                                    case "Furry Porn Comics and Furries Comics":
                                    case "Most Popular":
                                    case "":
                                        break;
                                    case "Gay &amp; Yaoi":
                                        returnJSON.tags.push("gay")
                                        break;
                                    case "Lesbian &amp; Yuri &amp; Girls Only":
                                        returnJSON.tags.push("lesbian")
                                        break;
                                    case "Straight Sex":
                                        returnJSON.tags.push("straight")
                                        break;
                                    default:
                                        if(!val.innerText.includes("Parody:"))
                                            returnJSON.tags.push(val.innerText.toLowerCase().trim())
                                        break;
                                }
                            })
                        }
                    })
        
                    json.querySelector('.my-gallery').childNodes.forEach(val => {
                        returnJSON.pages.push({
                            hq: val.querySelector('a').getAttribute('href'),
                            lq: val.querySelector('img').getAttribute('src')
                        })
                    })

                    returnJSON.source = 'hdporncomics.com'
                    returnJSON.title = json.querySelector('h1').innerText.trim()
                    returnJSON.cover = returnJSON.pages[0].hq

                    resolve(returnJSON)
                }, 1000)

                break;
            default:
                reject()
                return
        }
    })
}

module.exports = router
