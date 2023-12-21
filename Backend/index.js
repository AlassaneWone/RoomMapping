// index.js (backend)

const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
const io = require("socket.io")(httpServer);
const port = 3000;

const users = {};
const sessions = {};

io.on('connection', (socket) => {
    console.log('a user is connected');

    socket.on("checkSession", (data) => {
      const sessionId = data.sessionId;

      if (sessions[sessionId]) {
          socket.emit("sessionExists");
      } else {
          socket.emit("sessionDoesNotExist");
      }
  });

    socket.on("createSession", (data) => {
        const sessionId = data.sessionId;
        const username = data.username;
        socket.join(sessionId);
        users[socket.id] = { username, sessionId };
        
        // Ajouter la session à la liste des sessions
        sessions[sessionId] = { users: [socket.id] };

        console.log(`User ${username} created session ${sessionId}`);

        // Envoyer le sessionId au client
        socket.emit("sessionCreated", { sessionId });
    });

    socket.on("existingSessions", () => {
        const sessionIds = Object.keys(sessions);
        socket.emit("existingSessions", { sessionIds });
    });

    socket.on("joinSession", (data) => {
        const sessionId = data.sessionId;
        const username = data.username;
      
        // Vérifier si la session existe
        if (sessions[sessionId]) {
          socket.join(sessionId);
      
          // Ajouter l'utilisateur à la session
          const user = { id: socket.id, username };
          if (!sessions[sessionId].users) {
            sessions[sessionId].users = [];
          }
          sessions[sessionId].users.push(user);
      
          console.log(`User ${username} joined session ${sessionId}`);
      
          // Envoyer le sessionId au client
          socket.emit("sessionJoined", { sessionId });
        } else {
          // Gérer le cas où la session n'existe pas
          socket.emit("sessionError", { message: "Session not found" });
        }
      });
      

      socket.on("updateDrawing", (data) => {
        const { sessionId, username, data: drawingData } = data;

        // Vérifier si la session existe
        if (sessions[sessionId]) {
          // Envoyer l'événement à tous les utilisateurs de la session, sauf celui qui l'a émis
          socket.to(sessionId).emit("updateDrawing", { data: drawingData });
          console.log(`User ${username} updated drawing in session ${sessionId}`);
          console.log(drawingData);
        } else {
          // Gérer le cas où la session n'existe pas
          console.error("Session not found:", sessionId);
        }
      });
      
      socket.on("clearCanvas", ({ sessionId }) => {
        socket.to(sessionId).emit("clearCanvas");
      });
    
    

    socket.on('disconnect', () => {
        console.log('user disconnected');
        const user = users[socket.id];
        if (user && user.sessionId) {  // Ajoutez une vérification supplémentaire ici
            const sessionId = user.sessionId;
            const userIndex = sessions[sessionId].users.indexOf(socket.id);
            sessions[sessionId].users.splice(userIndex, 1);
            const username = user.username;
    
            console.log(`User ${username} disconnected from session ${sessionId}`);
    
            delete users[socket.id];
    
            // Envoyer un message de déconnexion à tous les utilisateurs de la session
            io.to(sessionId).emit("userDisconnected", { userId: socket.id });
        }
    });    
});

httpServer.listen(port, () => {
    console.log("Server running on port: " + port);
});

function generateRandomSessionId() {
    return Math.random().toString(36).substring(2, 8);
}
