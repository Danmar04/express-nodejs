const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const csrf = require('csurf');

//RENDERING MOTOR
const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');



//Routers
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

//Controllers
const errorController = require('./controllers/errors');

//DB
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');
var myStore = new SequelizeStore({
    db: sequelize
});

//Security
const csrfProtection = csrf();


console.log("Iniciando servidor");
//MIDDLEWARES
//Parser bodies
app.use(bodyParser.urlencoded({ extended: false }));
//Sirve las carpetas estaticas
app.use(express.static(path.join(__dirname, 'public')));
//Sessions
app.use(session({
    secret: 'my secret',
    store: myStore,
    resave: false,
    proxy: true,
    saveUninitialized: false
}));

app.use(csrfProtection);

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

//SECURITY CSRF FOR ALL ROUTES
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLogedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use('/admin', adminRoutes);

app.use(shopRoutes);

app.use(authRoutes);

app.use(errorController.getPageNotFound);

//Model relationships
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

myStore
    .sync()
    .then(result => {
        return sequelize.sync();
    })
    .then(result => {
        app.listen(3000);
    }).catch(err => {
        console.log(err);
    })
