


console.log("fuck you");

var ac, sp;
var bufsize = 4096;
window.addEventListener('load', init, false);
function init() {
  try {
    // Fix up for prefixing
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    ac = new AudioContext();
  }
  catch(e) {
    alert('Web Audio API is not supported in this browser');
  }


  sp = ac.createScriptProcessor(bufsize);
  sp.connect(ac.destination);
  sp.onaudioprocess = doit;
}

  function doit(e)
{

	var ob = e.outputBuffer;

	// Loop through the output channels (in this case there is only one)
  for (var channel = 0; channel < ob.numberOfChannels; channel++) {
    var out = ob.getChannelData(channel);

    // Loop through the 4096 samples
    for (var sample = 0; sample < ob.length; sample++) {

      // add noise to each output sample
      out[sample] = ((Math.random() * 2) - 1);         
    }
  }
}


