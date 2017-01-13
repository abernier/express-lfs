var express = require('express')
var app = express()

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.use(express.static('public'))
app.use('/public/:file', function (req, res, next) {
  console.log(req.params.file)
  next()
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})