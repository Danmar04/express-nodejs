module.exports = (req, res, next) => {
    if (!req.session.isLogedIn) {
        return res.redirect('/');
    }

    next();
}