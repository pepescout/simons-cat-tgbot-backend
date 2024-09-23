import 'dotenv/config'
import cors from 'cors';
import express from 'express';
import * as mongoose from 'mongoose';
import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';

import { runBot } from './controller/botController';
import { runCron } from './controller/gameController';
import { configurePassport } from './passport';

import router from './route';

const app = express();
app.use(cookieSession({
    name: 'session',
    keys: ["SCAT_TG_COOKIE"],
    maxAge: 24 * 60 * 60 * 1000
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }));
app.use(bodyParser.text({ type: 'text/html' }));
app.use(cors('*' as cors.CorsOptions));

configurePassport(app);

// Define a route for the root path ('/')
app.use('/api/', router);

app.get('/', (req, res) => {
    // Send a response to the client
    res.send('Hello, TypeScript + Node.js + Express!');
});


// Start the server and listen on the specified port
mongoose
    .connect(process.env.DATABASE as string)
    .then(() => {
        console.log('Database is connected');
        app.listen(process.env.PORT, () => {
            // Log a message when the server is successfully running
            console.log(`Server is running on http://localhost:${process.env.PORT}`);
            runBot();
            runCron();
        });
    })
    .catch((error: any) => {
        console.log('database connection error => ', error);
    });