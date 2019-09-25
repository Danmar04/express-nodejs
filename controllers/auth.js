
exports.getLogin = (req, res, next) => {
    console.log(req.session);
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: req.isLogedIn
    });
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'SignUp',
        isAuthenticated: false
    });
};

exports.postSignup = (req, res, next) => {
    console.log(req.body);
};


exports.postLogin = (req, res, next) => {
    req.session.isLogedIn = true;
    res.redirect(('/'));
};

exports.postLogOut = (req, res, next) => {
    req.session.destroy(result => {
        res.redirect('/');
    });
}