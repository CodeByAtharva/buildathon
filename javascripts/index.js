// Access user camera
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('captureButton');
const submitButton = document.getElementById('submitButton');
const context = canvas.getContext('2d');

// Prompt the user for camera access
navigator.mediaDevices.getUserMedia({ video: true })
  .then((stream) => {
    video.srcObject = stream;
  })
  .catch((err) => {
    alert("Camera access denied. Please allow access.");
  });

// Capture the image when the button is clicked
captureButton.addEventListener('click', () => {
  // Set canvas size to video dimensions
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  // Draw the current video frame onto the canvas
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Hide video and show canvas
  video.style.display = 'none';
  canvas.style.display = 'block';

  // Show submit button
  submitButton.style.display = 'inline-block';
});

// Submit the captured image (You can extend this to send data to a server)
submitButton.addEventListener('click', () => {
  // Convert canvas to image (Base64 format)
  const imageData = canvas.toDataURL('image/png');
  
  // Here, you can send imageData to the server for processing or saving
  alert("Image captured and ready for submission!");

  // For demonstration, we'll just log the image data in the console
  console.log(imageData);

  // Reset for next capture
  video.style.display = 'block';
  canvas.style.display = 'none';
  submitButton.style.display = 'none';
});