
'use strict';

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const app = express();
const bodyParser = require('body-parser');
const { DATABASE_URL, PORT } = require('./config');

const userRouter = require("./routers/users");

app.use('/users', userRouter); // call for the router users
app.use(bodyParser.json());

let server;


function runServer(databaseUrl, port = PORT) {
    //const port = process.env.PORT || 8080;
    return new Promise((resolve, reject) => {
    
        mongoose.connect(databaseUrl, err => {
            if (err) {
              return reject(err);
            }


        server = app
            .listen(port, () => {
                console.log(`Your app is listening on port ${port}`);
                resolve(server);
            })
            .on("error", err => {
                mongoose.disconnect();
                reject(err);
            });
    });
});
}


function closeServer() {
    return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
        console.log("Closing server");
        server.close(err => {
            if (err) {
                reject(err);

                return;
            }
            resolve();
        });
    });
});
}


if (require.main === module) {
    runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
