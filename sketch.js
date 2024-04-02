let inputImage;
let usingWebcam = false;
let video;
let theShader;


// Assign the canvas element to the 'canvas' variable

document.getElementById('fileInput').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      inputImage = loadImage(e.target.result);
      usingWebcam = false;
    };
    reader.readAsDataURL(file);
  }
});

document.getElementById('switchToWebcam').addEventListener('click', function() {
  usingWebcam = true;
});

function preload() {
  theShader = loadShader('uniform.vert', 'uniform.frag');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL); // Create canvas using window width and height
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

    // Call adjustCanvasSize initially to set canvas size
    adjustCanvasSize();
}

function draw() {
  resizeCanvas(windowWidth, windowHeight); // Resize canvas to match window size
  
  shader(theShader);

  theShader.setUniform("u_resolution", [width, height]);
  theShader.setUniform("u_time", millis() / 1000.0);
  theShader.setUniform("u_mouse", [mouseX, map(mouseY, 0, height, height, 0)]);

  if (usingWebcam) {
    theShader.setUniform('tex0', video);
  } else {
    if (inputImage) {
      theShader.setUniform('tex0', inputImage);
    } else {
      // If no image is uploaded, use webcam feed
      theShader.setUniform('tex0', video);
    }
  }

  rect(0, 0, width, height);
}




function adjustCanvasSize() {
  resizeCanvas(windowWidth, windowHeight);
}

// Add event listener for window resize event
window.addEventListener('resize', adjustCanvasSize);

 
//////

