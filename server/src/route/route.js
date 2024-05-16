module.exports = app => {
    require('./auth.route')(app)
    require('./home.route')(app)
    // require('./app.route')(app)
}

