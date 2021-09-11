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
