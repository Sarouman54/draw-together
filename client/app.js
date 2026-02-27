// client/app.js

const socket = io('http://localhost:3000');

const canvas = document.getElementById('whiteboard');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');

let drawing = false;
let current = { x: 0, y: 0};

function drawLine(x0, y0, x1, y1, color, emit) {
	ctx.beginPath();
	ctx.moveTo(x0, y0);
	ctx.lineTo(x1, y1);
	ctx.strokeStyle = color;
	ctx.lineWidth = 3;
	ctx.stroke();
	ctx.closePath();

	if (!emit) return;

	emit = true;
	socket.emit('draw_line', {
		x0: x0,
		y0: y0,
		x1: x1,
		y1: y1,
		color: color
	});
}

canvas.addEventListener('mousedown', (e) => {
	drawing = true;
	current.x = e.offsetX;
	current.y = e.offsetY;
});

canvas.addEventListener('mousemove', (e) => {
	if (!drawing) return;

	drawLine(current.x, current.y, e.offsetX, e.offsetY, colorPicker.value, true);
	current.x = e.offsetX;
	current.y = e.offsetY;
});

canvas.addEventListener('mouseup', (e) => { drawing = false; });
canvas.addEventListener('mouseout', (e) => { drawing = false; });

socket.on('draw_line', (data) => {
	drawLine(data.x0, data.y0, data.x1, data.y1, data.color, false);
});