const express = require("express"); // access
const socket = require("socket.io");

const app = express();  // initialize and server ready

app.use(express.static("public"));

let port = 3000;
let server = app.listen(port, () => {
    console.log('listening to port ' + port);
})

let io = socket(server);

io.on("connection", (socket ) => {
    console.log(`made socket connection`);

    // received data from frontend of a client
    socket.on("startDrawing", (data) => {
        // transfer data to all connected computers
        io.sockets.emit("startDrawing", data);
    })

    socket.on("draw", (data) => {
        io.sockets.emit("draw", data);
    })

    socket.on("redoUndo", (data) => {
        io.sockets.emit("redoUndo", data);
    })
})
