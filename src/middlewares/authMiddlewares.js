exports.isAuthenticated = (req, res, next) => {
    if (req.session.user) next()
    else next('route')
}

exports.isAdmin = (req, res, next) => {
    if (req.session.user.email = 'admin@watchstore.com') next()
    else next('route')
}

