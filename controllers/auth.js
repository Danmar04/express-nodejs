const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false,
        error: null
    });
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'SignUp',
        isAuthenticated: false,
        error: null
    });
};

exports.postSignup = (req, res, next) => {
    console.log(req.body);
    const email = req.body.email;
    const password = req.body.password;
    const confirmedPassword = req.body.confirmedPassword;

    User.findOne({ where: { email: email } })
        .then((result) => {
            console.log(result);
            return result;
        })
        .then(usuario => {
            if (usuario) {
                return res.render('auth/signup', {
                    pageTitle: 'Signup',
                    path: '/signup',
                    isAuthenticated: false,
                    error: 'A user alredy exists with that email'
                })
            }
            if (!usuario) {
                return bcrypt.hash(password, 12);
            }
        })
        .then(hashedPassword => {
            if (password === confirmedPassword) {
                const newUser = new User({
                    email: email,
                    password: hashedPassword,
                    cart: { items: [] }
                });
                return newUser.save();
            }
        })
        .then(result => {
            console.log(result);
            console.log('Usuario creado!');
            res.redirect('/login');
        })
        .catch((err) => {
            console.log(err);
        });

};


exports.postLogin = (req, res, next) => {
    req.session.isLogedIn = true;
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ where: { email: email } })
        .then((user) => {
            if (!user) {
                return res.render('auth/login', {
                    pageTitle: 'Login',
                    path: 'login',
                    isAuthenticated: false,
                    error: 'Usuario / Contraseña inválidos'
                });
            }
            bcrypt
                .compare(password, user.password)
                .then((matchOK) => {
                    if (matchOK) {
                        req.session.isLogedIn = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            console.log(err);
                            res.redirect('/');
                        });
                    }
                    res.redirect('/login');
                })
                .catch((err) => {
                    console.log(err);
                    res.redirect('/login');
                });
        }).catch((err) => {
            console.log(err);
            res.redirect('/login');
        });

};

exports.postLogOut = (req, res, next) => {
    req.session.destroy(result => {
        res.redirect('/');
    });
}