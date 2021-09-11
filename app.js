const ex = require('express')
const app = ex()

app.use('/', require('./routes/index.js'))
app.use('/list', require('./routes/list'))
app.use('/comic', require('./routes/comic'))
app.use('/about', require('./routes/about'))

app.listen(3000)
