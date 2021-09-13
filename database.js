const MongoClient = require('mongodb').MongoClient
const uri = ''
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
var dbConnection = client.connect()

exports.getComic = (id) => {
    return new Promise((resolve, reject) => {
        dbConnection.then((db) => {
            db.db('YiffCollections')
                .collection('comic')
                .findOne({ id: id }, async (err, result) => {
                    if (result === null) result = {}
                    result.status = result.ongoing ? 'Ongoing' : 'Completed'
                    result.authors = result.author

                    result.pages = await result.pages.map(page => {return { lowquality: page.lq, highquality: page.hq}})

                    resolve(result)
                })
        })
    })
}

exports.getComics = (title, tags, author, allowOngoing, sort, count, page) => {
    return new Promise(async (resolve, reject) => {
        const query = await this.genQuery(title, tags, author, allowOngoing)
        switch (sort) {
            case 'tasc':
                sort = { title: 1 }
                break
            case 'tdesc':
                sort = { title: -1 }
                break
            default:
                sort = { title: 1 }
                break
        }
        dbConnection.then((db) => {
            db.db('YiffCollections')
                .collection('comic')
                .find(query)
                .sort(sort)
                .limit(page * count)
                .toArray((err, result) => {
                    if (err) throw err
                    resolve(result.splice((page - 1) * count, page * count))
                })
        })
    })
}

exports.getPageCount = (title, tags, author, allowOngoing) => {
    return new Promise(async (resolve, reject) => {
        const query = await this.genQuery(title, tags, author, allowOngoing)
        dbConnection.then(async (db) => {
            resolve(await db.db('YiffCollections')
                .collection('comic')
                .find(query)
                .count())
        })
    })
}

exports.genQuery = (title, tags, author, allowOngoing) => {
    return new Promise((resolve, reject) => {
        const query = {}
        if (title || author || tags.length != 0) {
            query.$and = []

            if(title) query.$and.push({ title: { $regex: `.*${title}.*`, $options: 'i' } })
            if(author) query.$and.push({ author: { $regex: `.*${author}.*`, $options: 'i' } }) // TODO change to authors

            tags.forEach((term) => {
                query.$and.push({ tags: { $regex: `.*${term}.*`, $options: 'i' } })
            })
        }
        resolve(query)
    })
}

exports.getAuthors = () => {
    return new Promise((resolve, reject) => {
        dbConnection.then((db) => {
            db.db('YiffCollections')
                .collection('comic')
                .distinct('author') // TODO change to authors
                .then((result) => {
                    resolve(result)
                })
        })
    })
}
