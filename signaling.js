//var Peer = require('simple-peer');
var signalhub = require('signalhub');

var hub = signalhub('signaling-app', ['http://localhost:9970']);

hub.subscribe('signaling-app')
  .on('data', function(data) {
    console.log('new signalhub data:', data);
  });

hub.broadcast('signaling-app', {msg: "hello world" + Math.random() });
