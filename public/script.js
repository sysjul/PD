const webcam = document.getElementById('webcam');
const analyzeBtn = document.getElementById('analyze-btn');
const wallMeasurement = document.getElementById('wall-measurement');
const paintVolume = document.getElementById('paint-volume');
const pastMeasurementsList = document.getElementById('past-measurements-list');

const socket = io();

// Access the webcam
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        webcam.srcObject = stream;
    })
    .catch(error => {
        console.error('Error accessing webcam:', error);
    });

// Button click handler to analyze the measurement
analyzeBtn.addEventListener('click', () => {
    // Emit event to server to perform the analysis
    socket.emit('analyze-wall', { action: 'analyze' });
});

// Listen for analysis result from the server
socket.on('analysis-result', data => {
    const { length, height, paintVolumeRequired, pastMeasurements } = data;

    // Update UI with analysis data
    wallMeasurement.innerHTML = `Length: ${length} m, Height: ${height} m`;
    paintVolume.innerHTML = `Paint Volume: ${paintVolumeRequired} liters`;

    // Update past measurements
    pastMeasurementsList.innerHTML = '';
    pastMeasurements.forEach(measurement => {
        const li = document.createElement('li');
        li.textContent = `Length: ${measurement.length} m, Height: ${measurement.height} m, Paint: ${measurement.paintVolumeRequired} liters`;
        pastMeasurementsList.appendChild(li);
    });
});
