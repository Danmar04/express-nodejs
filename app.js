const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/errors');


app.set('view engine', 'ejs');
app.set('views', 'views');


//MIDDLEWARES
//Parser bodies
app.use(bodyParser.urlencoded({ extended: false }));
//Sirve las carpetas estaticas
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);

app.use(shopRoutes);

app.use(errorController.getPageNotFound);

app.listen(3000);