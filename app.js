const ex = require('express')
const app = ex()

app.use('/', require('./routes/index.js'))

app.listen(3000)
