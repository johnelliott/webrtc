var signalhub = require('signalhub');
var Peer = require('simple-peer')
var hub = signalhub('signaling-app', ['http://localhost:9970']);
//get video/voice
navigator.webkitGetUserMedia({ video: true, audio: false }, gotMedia, console.error);

function gotMedia(stream) {
  // set up local video first
  var video = document.querySelector('video#local');
  video.src = window.URL.createObjectURL(stream);

  var p = new Peer({ initiator: location.hash === '#1', stream: stream, trickle: false })
  var name = "peer " + Math.random();
  console.log("I am", name);

  // Subscribe to new peers
  hub.subscribe('signaling-app').on('data', function(data) {
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
    console.log('CONNECT: peer connection and data channel are ready to use');
    p.send('whatever' + Math.random());
  })

  p.on('stream', function (mediaStream) {
    console.log('STREAM: Received a remote video stream, which can be displayed in a video tag');
    var video = document.querySelector('video#peer');
    video.src = window.URL.createObjectURL(mediaStream)
  });

}
