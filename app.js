const ex = require('express')
const app = ex()

// body-parser middlerware
app.use(ex.urlencoded({extended: true}));
app.use(ex.json())

app.use('/', require('./routes/index.js'))
app.use('/list', require('./routes/list'))
app.use('/comic', require('./routes/comic'))
app.use('/about', require('./routes/about'))
app.use('/import', require('./routes/import'))

app.listen(3000)
