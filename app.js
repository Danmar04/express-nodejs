const express = require('express');
const bodyParser = require('body-parser');
const app = express();

//Parser bodies
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', (req, res, next) => {
    console.log('Im the first middleware');
    next();
});

app.use('/users', (req, res, next) => {
    res.send('<h1>This is the second  middleware</h1>');
});

app.listen(3000);