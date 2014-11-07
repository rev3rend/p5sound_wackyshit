// first order IIR lowpass filter (one-pole)
// a = {0., 1.};
// b = 1.0-a;
// y(n) = ax(n) + by(n-1);

var ac, sp;
var bufsize = 512;
var global_amp; // raw amplitude based on mouse
var global_iamp; // interpolated amplitude based on script processor
var global_smooth;
var global_ismooth;

var saved_amp = new Array(2);

function setup() 
{
	createCanvas(800, 600);
	background(255, 0, 0);
	console.log("fuck you");

	global_amp = 0.;
	global_iamp = 0.;
	global_smooth = 0.;
	global_ismooth = 0.;
	saved_amp[0] = 0.;
	saved_amp[1] = 0.;

	ac = getAudioContext();
	sp = ac.createScriptProcessor(bufsize);
 	sp.connect(ac.destination);
	sp.onaudioprocess = doit;
}

function draw()
{

	   	global_amp = constrain(map(mouseY, 0, height, 1., 0.), 0., 1.);
	   	global_smooth = constrain(map(mouseX, 0, width, 1., 0.), 0., 1.);

}



function doit(e)
{

	var ob = e.outputBuffer;

	var local_amp = global_amp; // copy for efficiency
	var local_smooth = global_smooth;
	var local_iamp; // use for efficiency
	var local_ismooth;
	var local_avg;

	// STEP 1: fill it with noise
 	for (var channel = 0; channel < ob.numberOfChannels; channel++) {
 	   var out = ob.getChannelData(channel);

 	   for (var sample = 0; sample < ob.length; sample++) {
 	     	out[sample] = ((Math.random() * 2) - 1);         
 	   }

  	}

  	// STEP 2: filter the noise (MOUSEX)
  for (var channel = 0; channel < ob.numberOfChannels; channel++) {
    var out = ob.getChannelData(channel);
	local_ismooth = global_ismooth; // copy over
 
    // Loop through the 4096 samples
    for (var sample = 0; sample < ob.length; sample++) {

    	local_ismooth = 0.99*local_ismooth + 0.01*local_smooth; // interpolate amplitude

    	if(sample==0) {
    		local_avg = (1.0-local_ismooth)*out[sample] + (local_ismooth)*saved_amp[channel];
    	}
    	else {
    		local_avg = (1.0-local_ismooth)*out[sample] + (local_ismooth)*out[sample-1];
    	}

    	if(sample==ob.length-1) saved_amp[channel] = out[sample];
    	out[sample] = local_avg; 
    }

  }


  // STEP 3: amplitude (MOUSEY)
	// Loop through the output channels (in this case there is only one)
  for (var channel = 0; channel < ob.numberOfChannels; channel++) {
    var out = ob.getChannelData(channel);
	local_iamp = global_iamp; // copy over
 
    // Loop through the 4096 samples
    for (var sample = 0; sample < ob.length; sample++) {

    	local_iamp = 0.99*local_iamp + 0.01*local_amp; // interpolate amplitude
 
       	out[sample] = local_iamp*out[sample];          
    }

  }

  // copy over smoothed variables
  global_iamp = local_iamp;
  global_ismooth = local_ismooth;
}


