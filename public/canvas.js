let undoRedoTracker = []; // data 
let track = 0; // represent which action from tracker array

let pencilColors = document.querySelectorAll('.pencil-color');
let pencilWidth = document.querySelector('.pencil-width');
let eraserWidth = document.querySelector('.eraser-width');
let redo = document.querySelector('.redo');
let undo = document.querySelector('.undo');

let pencilColor = "red";
let eraserColor = "white";

let canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let tool = canvas.getContext('2d');
tool.strokeStyle = pencilColor;
tool.lineWidth = pencilWidth.value; // default width of the line
tool.lineCap = 'round'; // round or butt
tool.lineJoin = 'round'; // round or bevel


let isDrawing = false;

// start drawing when the mouse is pressed down
function startDrawing(strokeObj) {
    tool.beginPath();
    tool.moveTo(strokeObj.x, strokeObj.y);
}

// draw a line based on the mouse position and the previous position of the mouse (x, y)
function draw(strokeObj) {
    tool.strokeStyle = strokeObj.color;
    tool.lineWidth = strokeObj.width;
    tool.lineTo(strokeObj.x, strokeObj.y);
    tool.stroke();
}

// stop drawing when the mouse is released
function stopDrawing() {
    // tool.closePath();
    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    track = undoRedoTracker.length - 1;
}

// clear the canvas
function clearCanvas() {
    tool.clearRect(0, 0, canvas.width, canvas.height);
}

// save the canvas as an image
function saveCanvas() {
    let link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download = 'board.png';
    link.click();
}

// draw the canvas when the mouse is moved
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    let data = {
        x: e.offsetX,
        y: e.offsetY
    }
    // send data to server
    socket.emit("startDrawing", data);
    // startDrawing(data);
});
canvas.addEventListener('mousemove', (e) => {
    if (isDrawing) {
        let data = {
            x: e.offsetX,
            y: e.offsetY,
            color: eraserFlag ? eraserColor : pencilColor,
            width: eraserFlag ? eraserWidth.value : pencilWidth.value
        };
        socket.emit("draw", data);
        // draw(data);
    }
});
canvas.addEventListener('mouseup', () => {
    isDrawing = false;
    stopDrawing()
});
canvas.addEventListener('mouseout', () => {
    isDrawing = false;
    stopDrawing();
});

// clear the canvas when the clear button is clicked
document.querySelector('.clear-canvas').addEventListener('click', clearCanvas);

// save the canvas when the save button is clicked
document.querySelector('.download').addEventListener('click', saveCanvas);

pencilColors.forEach(color => {
    color.addEventListener('click', function () {
        pencilColor = window.getComputedStyle(color).getPropertyValue("background-color");
        tool.strokeStyle = pencilColor;
    }
    );
});

pencilWidth.addEventListener('change', function () {
    tool.lineWidth = pencilWidth.value;
});

eraserWidth.addEventListener('change', function () {
    tool.lineWidth = eraserWidth.value;
});

eraser.addEventListener('click', function () {
    if (eraserFlag) {
        tool.strokeStyle = eraserColor;
        tool.lineWidth = eraserWidth.value;
    } else {
        tool.strokeStyle = pencilColor;
        tool.lineWidth = pencilWidth.value;
    }
});

// undo the last action
undo.addEventListener('click', function () {
    if (track > 0) {
        track--;
        let data = {
            trackValue: track,
            undoRedoTracker
        };
        socket.emit("redoUndo", data);
        // undoRedoCanvas(trackObj);
    }
});

// redo the last action
redo.addEventListener('click', function () {
    if (track < undoRedoTracker.length - 1) {
        track++;
        let data = {
            trackValue: track,
            undoRedoTracker
        };
        socket.emit("redoUndo", data);
        // undoRedoCanvas(trackObj);
    }
});

function undoRedoCanvas(trackObj) {
    let image = new Image();
    image.src = trackObj.undoRedoTracker[trackObj.trackValue];
    image.onload = function () {
        tool.drawImage(image, 0, 0);
    }
}

// recieved data from server (backend)
socket.on("startDrawing", (data) => {
    startDrawing(data);
})
socket.on("draw", (data) => {
    draw(data);
})
socket.on("redoUndo", (data) => {
    undoRedoCanvas(data)
})