const bcrypt = require('bcryptjs');


const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false,
        errorMessage: req.flash('error')
    });
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'SignUp',
        isAuthenticated: false,
        errorMessage: req.flash('error')
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
                req.flash('error', 'El correo ya está en uso.');
                return res.redirect('/signup');
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
            req.flash('error', 'Las contraseñas no coinciden.');
            return res.redirect('/signup');
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
                req.flash('error', 'Usuario / Contraseña inválidos');
                return res.redirect('/login');
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
                    req.flash('error', 'Usuario / Contraseña inválidos');
                    return res.redirect('/login');
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