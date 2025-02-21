document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(err => console.error("Error accessing camera: ", err));

    function capturePhoto() {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = canvas.toDataURL("image/png");
        const base64Image = imageData.split(",")[1];

        fetch("http://localhost:3000/process-face", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: base64Image })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.success) {
                alert("Face scan successful!");
            } else {
                alert("Face scan failed. Try again.");
            }
        })
        .catch(error => console.error("Error:", error));
    }

    document.getElementById("scan-button").addEventListener("click", capturePhoto);
});
