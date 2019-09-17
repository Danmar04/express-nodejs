const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const errorController = require('./controllers/errors');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');


app.set('view engine', 'ejs');
app.set('views', 'views');

console.log("Iniciando servidor");
//MIDDLEWARES
//Parser bodies
app.use(bodyParser.urlencoded({ extended: false }));
//Sirve las carpetas estaticas
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch((err) => {
            console.log(err);
        });
});

app.use('/admin', adminRoutes);

app.use(shopRoutes);

app.use(errorController.getPageNotFound);

//Model relationships
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });


sequelize
    .sync()
    .then(result => {
        // console.log(result);
        return User.findByPk(1);
    }).then(user => {
        if (!user) {
            return User.create({ name: 'Dani', email: 'daniel.martin@babel.es' });
        }
        return user;
    }).then(user => {

        return user.createCart();
    })
    .then(cart => {
        app.listen(3000);

    }).catch(err => {
        console.log(err);
    })
