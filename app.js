const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

//MIDDLEWARES
//Parser bodies
app.use(bodyParser.urlencoded({ extended: false }));
//Sirve las carpetas estaticas
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);

app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).send(path.join(__dirname, 'views', '404.html'));
});

app.listen(3000);