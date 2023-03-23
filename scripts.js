
const brushSizeInput = document.getElementById("brush-size");
const colorPicker = document.getElementById("color-picker");

const canvas = document.getElementById("drawing-board");
const context = canvas.getContext("2d");
const userIdDisplay = document.getElementById("user-id-display");

canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;

userIdDisplay.textContent = `User${(Math.floor(Math.random() * 100) + 1)}`;

colorPicker.value = (function getRandomColor() {
    return "#" + Array.from({length: 6}, () => "0123456789ABCDEF"[Math.floor(Math.random() * 16)]).join("");
})();

let drawing = false;
let previousPosition;

canvas.addEventListener("mousedown", (e) => {
    e.preventDefault();
    drawing = true;
    
    previousPosition = { x: e.clientX - canvas.offsetLeft, y: e.clientY - canvas.offsetTop };
    
    context.beginPath();
    context.moveTo(previousPosition.x, previousPosition.y);

    // Emit the 'startDrawing' event
    socket.emit("start-drawing", previousPosition);
});

canvas.addEventListener("mousemove", (e) => {

    if (!drawing) return;
    
    const currentPosition = {
        x: e.clientX - canvas.offsetLeft,
        y: e.clientY - canvas.offsetTop,
    };

    const data = {
        fp: previousPosition,
        tp: currentPosition,
        c: colorPicker.value,
        bs: brushSizeInput.value
    };

    drawLine(data.fp, data.tp, data.c, data.bs); 
    
    // Send the drawing data to the server
    socket.emit("drawing-data", data);

    // Update previousX and previousY
    previousPosition = currentPosition;
});

canvas.addEventListener("mouseup", () => { drawing = false; });

const socket = io.connect();

socket.on("drawing-data", (data) => {
    drawLine(data.fp, data.tp, data.c, data.bs);
});

socket.on("start-drawing", (data) => {
    context.beginPath();
    context.moveTo(data.x, data.y);
});

function drawLine(from, to, color, brushSize) {
    context.strokeStyle = color;
    context.lineWidth = brushSize;
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.stroke();
}