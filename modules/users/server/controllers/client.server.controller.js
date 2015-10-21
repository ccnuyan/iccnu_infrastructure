'use strict';

// Load required packages
var mongoose = require('mongoose');
var Client = mongoose.model('Client');

// Create endpoint /api/client for POST
exports.create = function (req, res) {
    // Create a new instance of the Client model
    var client = new Client();

    // Set the client properties that came from the POST data
    client.id = req.body.id;
    client.userId = req.user._id;
    client.name = req.body.name;
    client.secret = req.body.secret;
    client.description = req.body.description;
    client.authType = req.body.authType;
    client.redirectURI = req.body.redirectURI;
    client.homeURI = req.body.homeURI;

    // Save the client and check for errors
    client.save(function (err) {
        if (err) {
            return res.send(err);
        }

        res.json({
            message: 'Client added to the database!',
            data: client.toClientWithoutSecretHash()
        });
    });
};

// Create endpoint /api/clients for GET
exports.read = function (req, res) {
    // Use the Client model to find all clients
    Client.find({userId: req.user._id}, function (err, clients) {
        if (err) {
            return res.send(err);
        }

        res.json(clients);
    });
};
