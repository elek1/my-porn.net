const MongoClient = require('mongodb').MongoClient
const uri = ''
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
var dbConnection = client.connect()

exports.getComic = (id) => {
    return new Promise((resolve, reject) => {
        resolve({
            title: 'test',
            authors: [
                'hallo',
                'y o u'
            ],
            tags: [
                'test',
                'yes'
            ],
            status: 'completed',
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
        })
    })
}
