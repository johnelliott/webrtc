var signalhub = require('signalhub');
var Peer = require('simple-peer')
var hub = signalhub('signaling-app', ['http://localhost:9970']);

// application state
var state = {focus:{video:''}}
function logState() {
    console.log('--- BEGIN STATE ---')
    console.log('state', state)
    console.log('video focus', state.focus.video)
    console.log('--- END STATE ---')
}

// Get video/voice, then call main function
navigator.webkitGetUserMedia({ video: true, audio: false }, gotMedia, console.error);

function gotMedia(stream) {
  // set up local video first
  var video = document.querySelector('video#local');
  video.src = window.URL.createObjectURL(stream);
  // allow selecting this stream
  //https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Event_handlers
  video.onclick=function() {
    state.focus.video = 'local'
    logState()
  }

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

  // Incoming data form peer data channel
  p.on('data', function (data) {
   console.log('data: ' + data);
  })

  // New peer connects: peer connection and data channel are ready to use
  p.on('connect', function () {
    console.log('CONNECT');
    p.send('whatever' + Math.random());
  })

  // New media stream from peer
  p.on('stream', function (mediaStream) {
    console.log('STREAM: Received a remote video stream, which can be displayed in a video tag');
    var video = document.querySelector('video#peer');
    video.src = window.URL.createObjectURL(mediaStream)
    // allow selecting this stream
    //https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Event_handlers
    video.onclick=function() {
      console.log('local video clicked')
      state.focus.video = 'peer'
      logState()
    }
  });
}
