var signalhub = require('signalhub');
var Peer = require('simple-peer')

var hub = signalhub('signaling-app', ['http://localhost:9970']);

//get video/voice
navigator.webkitGetUserMedia({ video: true, audio: false }, gotMedia, function() {});

function gotMedia(stream) {
  var p = new Peer({ initiator: location.hash === '#1', stream: stream, trickle: false })
  var name = "peer " + Math.random();
  console.log("I am", name);

  // subscribe to new peers
  hub.subscribe('signaling-app')
    .on('data', function(data) {
      console.log('new signalhub data:', data);
      // check that message is from another peer
      if (data.name !== name) {
        console.log('message from another peer!');
        p.signal(data.msg);
      }
    });

  p.on('error', function (err) { console.log('error', err) });

  p.on('signal', function (data) {
    console.log('SIGNAL', JSON.stringify(data));
    document.querySelector('#outgoing').textContent = JSON.stringify(data);
    // broadcast this on signalhub
    hub.broadcast('signaling-app', {name: name, msg: data});
  })

  p.on('data', function (data) {
   console.log('data: ' + data);
  })

  p.on('connect', function () {
    console.log('CONNECT');
    p.send('whatever' + Math.random());
  })

  p.on('stream', function (data) {
    console.log('STREAM');
    var video = document.createElement('video')
    video.src = window.URL.createObjectURL(stream)
    document.body.appendChild(video);
  });

  document.querySelector('form').addEventListener('submit', function (ev) {
    ev.preventDefault();
    //p.signal(JSON.parse(document.querySelector('#incoming').value))
    console.log("offer button was clicked")
  })
}
