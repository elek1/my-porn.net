const express = require('express')
const router = express.Router()
const db = require('../database')
const pug = require('pug')

router.get('/', async (req, res) => {
    // Getting URL parameters
    const page = isNaN(req.query.page) ? 1 : (+req.query.page < 1 ? 1 : Math.floor(+req.query.page)) // TODO page
    const title = typeof req.query.title == 'undefined' ? '' : req.query.title
    const tags = typeof req.query.tags == 'undefined' ? [] : req.query.tags.split(' ')
    const author = typeof req.query.author == 'undefined' ? '' : req.query.author
    const sort = typeof req.query.sort == 'undefined' ? 'tasc' : req.query.sort
    const count = isNaN(req.query.count)
        ? 12
        : +req.query.count <= 0 || +req.query.count > 50
        ? 12
        : +req.query.count
    const allowOngoing = typeof req.query.allowOngoing == 'undefined' ? true : (req.query.allowOngoing == 'true' ? true : false)
    
    res.send(pug.renderFile('views/list.pug', {
        possibleAuthors: await db.getAuthors(),
        page: page,
        maxPage: (await db.getPageCount(title, tags, author, allowOngoing))/count,
        search: {
            title: title,
            tags: tags,
            author: author,
            sort: sort,
            count: count,
            allowOngoing: allowOngoing
        },
        comics: await db.getComics(title, tags, author, allowOngoing, sort, count, page)//count, page, filters) 
    }))
})

module.exports = router
