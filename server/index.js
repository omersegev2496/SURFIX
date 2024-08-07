require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

const beachRouter = require('./routers/beachRouter.js');
const sessionRouter = require('./routers/sessionRouter.js');
const userRouter = require('./routers/userRouter.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.set('Access-Control-Allow-Methods', "GET, POST, PUT, DELETE, OPTIONS");
    res.set('Content-Type', 'application/json');
    next();
});

app.use('/api/beach', beachRouter);
app.use('/api/session', sessionRouter);
app.use('/api/user', userRouter);

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});