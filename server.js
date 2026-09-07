const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const geoip = require('geoip-lite');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Permet à Render de transmettre correctement la vraie IP de l'utilisateur
app.set('trust proxy', true);

app.use(express.static(path.join(__dirname, 'public')));

let waitingUsers = [];

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

io.on('connection', (socket) => {
    console.log('Un utilisateur s est connecté :', socket.id);

    // Récupération rigoureuse de l'IP réelle (compatible Render / proxies)
    let clientIp = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address;
    if (clientIp && clientIp.includes(',')) {
        clientIp = clientIp.split(',')[0].trim();
    }
    
    // Nettoyage de l'IP locale IPv6 (ex: ::ffff:127.0.0.1 -> 127.0.0.1)
    if (clientIp && clientIp.substr(0, 7) == "::ffff:") {
        clientIp = clientIp.substr(7);
    }

    const geo = geoip.lookup(clientIp);
    // Si l'IP est locale ou non trouvée, on met 'CA' par défaut
    const country = (geo && geo.country) ? geo.country : 'CA';

    console.log(`IP détectée: ${clientIp} -> Pays: ${country}`);

    socket.on('join', (username) => {
        socket.data.username = username;
        socket.data.country = country;
    });

    socket.on('send_location', (coords) => {
        let antiLat = -coords.lat;
        let antiLon = coords.lon > 0 ? coords.lon - 180 : coords.lon + 180;

        socket.data.lat = coords.lat;
        socket.data.lon = coords.lon;
        socket.data.antiLat = antiLat;
        socket.data.antiLon = antiLon;

        let bestMatch = null;
        let minDistance = Infinity;

        waitingUsers.forEach((user) => {
            if (user.id !== socket.id) {
                let dist = getDistanceFromLatLonInKm(antiLat, antiLon, user.lat, user.lon);
                if (dist < minDistance) {
                    minDistance = dist;
                    bestMatch = user;
                }
            }
        });

        if (bestMatch) {
            waitingUsers = waitingUsers.filter(u => u.id !== bestMatch.id);

            const roomName = `room_${socket.id}_${bestMatch.id}`;
            socket.join(roomName);
            const otherSocket = io.sockets.sockets.get(bestMatch.id);
            if (otherSocket) {
                otherSocket.join(roomName);
            }

            io.to(roomName).emit('match_found', {
                users: [
                    { id: socket.id, username: socket.data.username, country: socket.data.country },
                    { id: bestMatch.id, username: bestMatch.username, country: bestMatch.country }
                ]
            });
        } else {
            waitingUsers.push({
                id: socket.id,
                lat: coords.lat,
                lon: coords.lon,
                username: socket.data.username,
                country: socket.data.country
            });
            socket.emit('waiting');
        }
    });

    socket.on('chat_message', (data) => {
        socket.rooms.forEach((room) => {
            if (room.startsWith('room_')) {
                io.to(room).emit('chat_message', {
                    username: socket.data.username,
                    text: data.text
                });
            }
        });
    });

    socket.on('disconnect', () => {
        waitingUsers = waitingUsers.filter(u => u.id !== socket.id);
        console.log('Utilisateur déconnecté :', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
});