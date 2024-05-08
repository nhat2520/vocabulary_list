const authMiddleware = require('../middlewares/auth.middleware')

module.exports = app => {
    var route = require('express').Router()
    
    route.get('/',authMiddleware.loggedin, (req, res) => {
        const {firstName, lastName} = res.locals.user
        console.log(firstName, lastName)
        res.render('index', {firstName, lastName} )
    }) 
    app.use(route)
}