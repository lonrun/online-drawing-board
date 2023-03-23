const canvas = document.getElementById('drawing-board');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;

let drawing = false;

canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    context.beginPath();
    context.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
});

canvas.addEventListener('mousemove', (e) => {
    if (!drawing) return;
    context.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    context.stroke();
});

canvas.addEventListener('mouseup', () => {
    drawing = false;
});
