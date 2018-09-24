
'use strict';

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
//const ejs = require('ejs');
//const path = require('path');
const bodyParser = require('body-parser');
const { DATABASE_URL, PORT, JWT_SECRET } = require('./config');
const userRouter = require("./routers/users");
const commentRouter = require("./routers/comments");
const fileRouter = require('./routers/pictures');
const busboy = require('connect-busboy');
const busboyBodyParser = require('busboy-body-parser');
const picturesRouter = require('./routers/pictures')


//app.set('view engine', 'ejs');
app.use(busboy());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(busboyBodyParser());

app.use('/users', userRouter); // call for the router users
app.use('/comments', commentRouter); // call comments router
app.use('/users/signup', userRouter); // call siign up user router 
app.use('/users/login', userRouter); // call login user router
app.use('/uploads', fileRouter); // call for the router users
app.use('/pictures', picturesRouter) //call for picture router
app.use(express.static('./public'));


//app.get('/' , (req, res)  =>  res.render('index'));
app.get('/' , (req, res)  => {} );

let server;


function runServer(databaseUrl, port = PORT) {
    //const port = process.env.PORT || 8080;
    //console.log(databaseUrl, "URL AND AUTH TO MONGODB");
    return new Promise((resolve, reject) => {
    
        mongoose.connect(databaseUrl, { useNewUrlParser: true }, err => {
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
