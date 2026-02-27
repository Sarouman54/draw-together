// server/index.js

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();

app.use(express.static('client'));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' }});

io.on('connection', (socket) => {
	console.log("Joueur connecté : ", socket.id);

	socket.on('draw_line', (data) => {
		socket.broadcast.emit('draw_line', data);
	});

	socket.on('disconnect', () => {
		console.log("Joueur déconnecté : ", socket.id);
	});
});

server.listen(3000, () => console.log('Draw Together running on 3000'));