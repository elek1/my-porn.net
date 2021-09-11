const express = require('express')
const router = express.Router()
const path = require('path')
const db = require('../database')
const fs = require('fs')
const pug = require('pug')

router.get('/', async (req, res) => {
    res.send(pug.renderFile('views/comic.pug', await db.getComic()))
})

/*router.get('/', (req, res) => {
    const id = +req.query.id
    if (typeof id !== 'number') res.send('Please enter an Id')
    else {
        db.getComic(id, (comic) =>
            fs.readFile(
                'pages/comic.html',
                {
                    root: path.join(__dirname, '..'),
                },
                (err, html) => {
                    if (err) throw err

                    let tagHTML = ''
                    comic.author.forEach(
                        (val) =>
                            (tagHTML += `<span class="badge badge-primary" style="cursor: pointer;" onclick="window.location='/author?name=${val.replace(' ', '_')}'">${val}</span> `)
                    )
                    comic.tags.sort()
                    comic.tags.forEach(
                        (val) =>
                            (tagHTML += `<span class="badge badge-secondary" style="cursor: pointer;" onclick="window.location='/list?search=${val.replace(' ', '_')}'">${val}</span>     `)
                    )

                    let pageHTML = ''
                    comic.pages.forEach(
                        (val) =>
                            (pageHTML += `<img src="${val.lq}" hq-src="${val.hq}" />`)
                    )

                    res.send(eval('`' + html.toString() + '`'))
                }
            )
        )
    }
})

router.post('/', (req, res) => {
    db.getComic(req.body.id, (comic) => res.send(comic))
})*/

module.exports = router
