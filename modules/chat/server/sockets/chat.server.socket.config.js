'use strict';

// Create the chat configuration
module.exports = function (io, socket) {
    // Emit the status event when a new socket client is connected

    if (socket.request.user) {
        io.emit('chatMessage', {
            type: 'status',
            text: 'Is now connected',
            created: Date.now(),
            profileImageURL: socket.request.user.profileImageURL,
            username: socket.request.user.username
        });
    }

    // Send a chat messages to all connected sockets when a message is received 
    socket.on('chatMessage', function (message) {
        if (socket.request.user) {
            message.type = 'message';
            message.created = Date.now();
            message.profileImageURL = socket.request.user.profileImageURL;
            message.username = socket.request.user.username;

            // Emit the 'chatMessage' event
            io.emit('chatMessage', message);
        }
    });

    // Emit the status event when a socket client is disconnected
    socket.on('disconnect', function () {
        if (socket.request.user) {
            io.emit('chatMessage', {
                type: 'status',
                text: 'disconnected',
                created: Date.now(),
                profileImageURL: socket.request.user.profileImageURL,
                username: socket.request.user.username
            });
        }
    });
};
