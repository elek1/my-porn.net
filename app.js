const ex = require('express')
const app = ex()

app.use('/', require('./routes/index.js'))
app.use('/comic', require('./routes/comic'))

app.listen(3000)
