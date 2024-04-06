


const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
let drawingData = []; // Store drawing data

function adjustCanvasSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  redrawCanvas();
  writeMessage();
}

let isDrawing = false;
let lastX = 0;
let lastY = 0;

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseout', stopDrawing);

function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = [e.clientX, e.clientY];
}

function stopDrawing() {
    isDrawing = false;
    ctx.beginPath();
}

function draw(e) {
    if (!isDrawing) return;

    // Adjust drawing coordinates based on canvas size
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = 1;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000'; // Color can be customized
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    [lastX, lastY] = [x, y];

    // Store drawing data
    drawingData.push({ x: lastX, y: lastY });
}

document.getElementById('clear-canvas').addEventListener('click', clearCanvas);

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawingData = []; // Clear drawing data
}

function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

// Debounce the writeMessage function to reduce redraw frequency
const debouncedWriteMessage = debounce(writeMessage, 300); // Adjust delay as needed

document.getElementById('message-input').addEventListener('input', debouncedWriteMessage);

document.getElementById('message-input').addEventListener('input', writeMessage);

let textColor = '#002ae8'; // Initial text color
const colors = ['#002ae8', '#fff', '#000']; // Array of colors


const colorButton = document.getElementById('colorButton');
colorButton.addEventListener('click', changeTextColor);

let colorIndex = 0; // Index to track current color


function changeTextColor() {
    colorIndex = (colorIndex + 1) % colors.length;
    textColor = colors[colorIndex];
    drawMessage(document.getElementById('message-input').value);
}

function drawMessage(message) {
    const padding = window.innerWidth * 0.3; // Adjust padding as needed
    const lineHeight = 20; // Adjust line height as needed
     // Get canvas dimensions


  // Calculate starting coordinates for centered text
  let y = window.innerHeight * 0.3; // Centered y-coordinate
 

  ctx.font = '20px s3';
  // Use the textColor variable for fill style
  ctx.fillStyle = textColor;  // Color can be customized

    const maxWidth = window.innerWidth * 0.4 - padding; // Adjust the maximum width as needed
    let words = message.split(/\s+/); // Split by whitespace
    let line = '';

    for (let i = 0; i < words.length; i++) {
        // Handle line breaks
        if (words[i] === '\n') {
            ctx.fillText(line, padding, y);
            y += lineHeight; // Move to the next line
            line = ''; // Reset line content
            continue; // Skip to the next word
        }

        let testLine = line + words[i];
        let testWidth = ctx.measureText(testLine).width;

        if (testWidth > maxWidth) {
            ctx.fillText(line, padding, y);
            y += lineHeight; // Move to the next line
            line = ''; // Reset line content
        }

        line += words[i];
        if (i < words.length - 1 && words[i + 1] !== '\n') {
            line += ' ';
        }
    }

    // Draw the last line
    ctx.fillText(line, padding, y);
}

// Listen for resize events and adjust canvas size accordingly
window.addEventListener('resize', adjustCanvasSize);

window.addEventListener('resize', function() {
    adjustCanvasSize();
    writeMessage();
});

// Listen for keyup events in the message input
document.getElementById('message-input').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        // If Enter key is pressed, add a line break in the input value
        this.value += '\n';
        // Write the message with the updated input value
        writeMessage();
    }
});

function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawingData.forEach((point, index) => {
        if (index === 0) {
            ctx.moveTo(point.x, point.y);
        } else {
            ctx.lineTo(point.x, point.y);
            ctx.stroke();
        }
    });
}

function writeMessage() {
    const message = document.getElementById('message-input').value;
    drawMessage(message);
}

adjustCanvasSize(); // Call adjustCanvasSize initially to set canvas size


function saveAsImage() {
  const canvas1 = document.getElementById('canvas1');
  const canvas2 = document.querySelector('.p5Canvas'); // Get the first canvas with class p5Canvas

  // Get the dimensions of the screen
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;

  // Create a new canvas element to capture the entire screen
  const combinedCanvas = document.createElement('canvas');
  const ctx = combinedCanvas.getContext('2d');
  combinedCanvas.width = screenWidth;
  combinedCanvas.height = screenHeight;

  // Draw canvas2 onto the canvas for the entire screen
  ctx.drawImage(canvas2, 0, 0, screenWidth, screenHeight);

  // Draw canvas1 onto the canvas for the entire screen
  ctx.drawImage(canvas1, 0, 0);

  // Convert the combined canvas to a data URL
  const imageURL = combinedCanvas.toDataURL('image/png');

  // Create a link for downloading the image
  const downloadLink = document.createElement('a');
  downloadLink.href = imageURL;
  downloadLink.download = 'combined-canvases.png'; // Set the file name for download

  // Trigger the download
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);

  const audio = new Audio('save.wav'); // Replace 'save_sound.mp3' with the path to your sound file
  audio.play();
}

// Add event listener to the button
document.getElementById('saveButton').addEventListener('click', saveAsImage);



// Add event listener to the document for keydown event
document.addEventListener('keydown', function(event) {
  // Check if the pressed key is "s" (keyCode 83) and the Shift key is also pressed
  if (event.keyCode === 83 && event.shiftKey) {
      // Call the saveAsImage function
      saveAsImage();
  }
});


// Function to play sound based on keyboard letter pressed
function playSound(event) {
  // Get the key that was pressed
  const key = event.key.toLowerCase();

  // Check if the key corresponds to a letter from 'a' to 'z'
  if (key >= 'a' && key <= 'z') {
      // Create an audio element
      const audio = new Audio(`sounds/${key}.wav`); // Assuming your sound files are in a 'sounds' folder

      // Play the audio
      audio.play();
  }
}

// Add event listener to the document for keydown event
document.addEventListener('keydown', playSound);

$(document).ready(function() {
  // Make the popup draggable
  $('#popup-container-1').draggable();

  // Close the popup when clicking on the close button
  $('#close-btn-1').click(function() {
      $('#popup-container-1').hide();
  });
});


$(document).ready(function() {
  // Make the popup draggable
  $('#popup-container-2').draggable();

  // Close the popup when clicking on the close button
  $('#close-btn-2').click(function() {
      $('#popup-container-2').hide();
  });
});

$(document).ready(function() {
    // Make the popup draggable
    $('#popup-container-3').draggable();
  
    // Close the popup when clicking on the close button
    $('#close-btn-3').click(function() {
        $('#popup-container-3').hide();
    });
  });

  $(document).ready(function() {
    // Make the popup draggable
    $('#popup-container-4').draggable();
  
    // Close the popup when clicking on the close button
    $('#close-btn-4').click(function() {
        $('#popup-container-4').hide();
    });
  });