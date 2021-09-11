const express = require('express')
const router = express.Router()
const db = require('../database')
const pug = require('pug')

router.get('/', async (req, res) => {
    // Getting URL parameters
    const page = isNaN(req.query.page) ? 1 : +req.query.page
    const count = isNaN(req.query.count)
        ? 12
        : +req.query.count <= 0 || +req.query.count > 50
        ? 12
        : +req.query.count
    const sort = typeof req.query.sort == 'undefined' ? 'tasc' : req.query.sort
    const search = typeof req.query.search == 'undefined' ? '' : req.query.search

    const filters = { sort: sort }

    // window.history.pushState({}, "", "list.html")

    if (search.length > 0){
        filters.search = []
        search.split(' ').forEach((val) => filters.search.push(val.replace('_', ' ')))
    }
    
    res.send(pug.renderFile('views/list.pug', { search: search, comics: await db.getComics(count, page, filters) }))
})

module.exports = router
