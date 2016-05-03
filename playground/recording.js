var RecordRTC = require('recordrtc')
var fetch = require('isomorphic-fetch')

// chrome only...
var getUserMedia = navigator.webkitGetUserMedia

var constraints = { audio: true, video: false };

var prom = new Promise(function(resolve, reject) {
  getUserMedia.call(navigator, constraints, resolve, reject);
});

prom.then(function(stream) {
  var audio = document.querySelector('audio#audio');
  var download = document.querySelector('a#download');
  audio.src = window.URL.createObjectURL(stream);
  var options = {
    mimeType: 'audio/ogg', // or video/mp4 or audio/ogg
    bitsPerSecond: 128000 // if this line is provided, skip above two
  }
  var recordRTC = RecordRTC(stream, options)
  recordRTC.startRecording()
  console.log('starting')
  setTimeout(function stop() {
    recordRTC.stopRecording(function(audioURL) {
      console.log('stopping', typeof audioURL)
      download.href = audioURL
      // populate download link
      audio.src = audioURL
      audio.play()
    })
  }, 3500)
})
.catch(function(err) {
  console.log(err.name + ": " + err.message);
});
