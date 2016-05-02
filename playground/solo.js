// chrome only...
var getUserMedia = navigator.webkitGetUserMedia

var constraints = { audio: false, video: { width: 300, height: 120 } };

var prom = new Promise(function(resolve, reject) {
  getUserMedia.call(navigator, constraints, resolve, reject);
});

prom.then(function(stream) {
  var video = document.querySelector('video');
  video.src = window.URL.createObjectURL(stream);
  video.onloadedmetadata = function(e) {
    video.play();
  };
})
.catch(function(err) {
  console.log(err.name + ": " + err.message);
});
