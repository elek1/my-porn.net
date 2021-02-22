const ex = require('express')
const app = ex()

app.get('/', (req, res) => res.send('test'))

app.listen(3000)
