const express = require('express')
const router = express.Router()
const path = require('path')
// const db = require('../database')
const fs = require('fs')
const pug = require('pug')

router.get('/', (req, res) => {
    res.send(pug.renderFile('views/comic.pug', {
        title: 'test',
        authors: [
            'hallo',
            'y o u'
        ],
        tags: [
            'test',
            'yes'
        ],
        pages: [
            {
                'low-quality': 'https://static1.e621.net/data/sample/eb/d3/ebd39570b1917e10e1f6a85190215294.jpg',
                'high-quality': 'https://static1.e621.net/data/eb/d3/ebd39570b1917e10e1f6a85190215294.png'
            },
            {
                'low-quality': 'https://static1.e621.net/data/sample/3e/57/3e57ac46fd4d1c916d47e8ce357918f2.jpg',
                'high-quality': 'https://static1.e621.net/data/3e/57/3e57ac46fd4d1c916d47e8ce357918f2.png'
            },
            {
                'low-quality': 'https://static1.e621.net/data/sample/58/59/5859473a1e760366fc0a72d1f69bbae1.jpg',
                'high-quality': 'https://static1.e621.net/data/58/59/5859473a1e760366fc0a72d1f69bbae1.png'
            }
        ]
    }))
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
