var http = require('http')
var fs = require('fs')

var server = http.createServer(function(req, res) {
  if (req.method === 'POST') {
    console.log('got post!')
    console.log('headers?', res.headers)
    var file = fs.createWriteStream(`./tmp/${new Date().valueOf()}.ogg`)
    req.pipe(process.stdout)
    req.on('end', () => {
      process.stdout.write('\n')
      res.end('ok')
    })
  }
  else {
    res.end('gotta be post to work on this server\n')
  }
})

const port = 9966
server.listen(port)
console.log('listening on '+port)
