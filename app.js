const express = require('express');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

let pastMeasurements = [
    { wall: 'Wall 1:', length: '8.38 m', height: '0.91 m', paintVolume: '0.76 liters' },
    { wall: 'Wall 2:', length: '6.20 m', height: '2.10 m', paintVolume: '1.50 liters' },
    { wall: 'Wall 3:', length: '7.50 m', height: '2.50 m', paintVolume: '1.90 liters' },
    { wall: 'Wall 4:', length: '5.00 m', height: '3.00 m', paintVolume: '2.10 liters' }
];

const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// Initialize Socket.io
const io = socketIo(server);

// Serve the welcome page when visiting the root route '/'
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'welcome.html'));  // Serve welcome.html on root
});

// Serve the webcam preview page when visiting '/webcam'
app.get('/webcam', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'webcam.html'));  // Serve webcam.html for /webcam route
});

// Serve the detected walls page when visiting '/detected-walls'
app.get('/detected-walls', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'detected-walls.html'));  // Serve detected-walls.html for /detected-walls route
});

// Serve the storage page when visiting '/storage'
app.get('/storage', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'storage.html'));
});

// Uncomment the following code if you need a user route
// app.get('/user', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'user.html'));
// });

// Handle the analysis event (for wall measurements)
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle analyze-wall event (simulate wall measurement)
    socket.on('analyze-wall', (data) => {
        console.log('Analyzing wall...');
        const length = (Math.random() * 10).toFixed(2);
        const height = (Math.random() * 4).toFixed(2);
        const paintVolumeRequired = (length * height * 0.1).toFixed(2);

        socket.emit('analysis-result', {
            length,
            height,
            paintVolumeRequired
        });
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});
