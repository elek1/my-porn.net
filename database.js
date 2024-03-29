const MongoClient = require('mongodb').MongoClient
const uri = ''
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
var dbConnection = client.connect()

const dbOptions = Object.freeze({
    db: 'YiffCollections',
    collection: 'comic'
})

exports.getComic = (id) => {
    return new Promise((resolve, reject) => {
        dbConnection.then((db) => {
            db.db(dbOptions.db)
                .collection(dbOptions.collection)
                .findOne({ id: id }, async (err, result) => {
                    if (err) throw err
                    if (result === null) result = {}
                    if(typeof result.ongoing == 'boolean') // TODO change ongoing field to status
                        result.status = result.ongoing ? 'Ongoing' : 'Completed'
                    else
                        result.status = result.ongoing
                    result.authors = result.author

                    result.pages = await result.pages.map(page => { return { lowquality: page.lq, highquality: page.hq } })

                    resolve(result)
                })
        })
    })
}

exports.getComics = (title, tags, author, allowOngoing, sort, count, page) => {
    return new Promise(async (resolve, reject) => {
        const query = await this.genQuery(title, tags, author, allowOngoing)
        switch (sort.toLowerCase()) {
            case 'tasc':
                sort = { title: 1 }
                break
            case 'tdesc':
                sort = { title: -1 }
                break
            case 'idasc':
                sort = { id: 1 }
                break
            case 'iddesc':
                sort = { id: -1 }
                break
            default:
                sort = { title: 1 }
                break
        }
        dbConnection.then((db) => {
            db.db(dbOptions.db)
                .collection(dbOptions.collection)
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
            resolve(await db.db(dbOptions.db)
                .collection(dbOptions.collection)
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

            if (title) query.$and.push({ title: { $regex: `.*${title}.*`, $options: 'i' } })
            if (author) query.$and.push({ author: { $regex: `.*${author}.*`, $options: 'i' } }) // TODO change to authors

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
            db.db(dbOptions.db)
                .collection(dbOptions.collection)
                .distinct('author') // TODO change to authors
                .then((result) => {
                    resolve(result)
                })
        })
    })
}

exports.addComic = (json) => {
    return new Promise((resolve, reject) => {
        dbConnection.then(db => {
            db.db(dbOptions.db)
                .collection(dbOptions.collection)
                .find()
                .sort({ id: -1 })
                .limit(1)
                .toArray((err, result) => {
                    if (err) throw err
                    json.id = result[0].id+1
                    db.db("YiffCollections").collection("comic").insertOne(json, (err, resp) => {
                        if (err) throw err;
                        resolve()
                    });
                })
        })
    })
}
