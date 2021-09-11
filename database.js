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

exports.getComics = (count, page, filters) => {
    return new Promise((resolve, reject) => {
        const query = {}
        if (filters.hasOwnProperty('search')) {
            query.$or = []
            filters.search.forEach((term) => {
                query.$or.push({ tags: { $regex: `.*${term}.*`, $options: 'i' } })
                query.$or.push({ author: { $regex: `.*${term}.*`, $options: 'i' } })
                query.$or.push({ title: { $regex: `.*${term}.*`, $options: 'i' } })
            })
        }
        switch (filters.sort) {
            case 'tasc':
                filters.sort = { title: 1 }
                break
            case 'tdesc':
                filters.sort = { title: -1 }
                break
            default:
                filters.sort = { title: 1 }
                break
        }
        dbConnection.then((db) => {
            db.db('YiffCollections')
                .collection('comic')
                .find(query)
                .sort(filters.sort)
                .limit(page * count)
                .toArray((err, result) => {
                    if (err) throw err
                    resolve(result.splice((page - 1) * count, page * count))
                })
        })
    })
}
