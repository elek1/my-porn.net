const express = require('express')
const router = express.Router()
const db = require('../database')
const pug = require('pug')

router.get('/', async (req, res) => {
    res.send(pug.renderFile('views/comic.pug', await db.getComic(+req.query.id)))
})

module.exports = router
