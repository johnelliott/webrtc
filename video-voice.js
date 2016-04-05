var SimplePeer = require('simple-peer');

//get video/voice
navigator.webkitGetUserMedia({ video: true, audio: false }, gotMedia, function() {});

function gotMedia (stream) {
  var peer1 = new SimplePeer({initiator: true, stream: stream });
  var peer2 = new SimplePeer({initiator: false, stream: stream });

  peer1.on('signal', function (data) {
    peer2.signal(data);
  });

  peer2.on('signal', function (data) {
    peer1.signal(data);
  });

  peer2.on('stream', function (data) {
    var video = document.querySelector('video');
    video.src = window.URL.createObjectURL(stream);
    video.play();
  });
}
