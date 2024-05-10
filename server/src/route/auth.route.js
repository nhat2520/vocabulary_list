const login = require('../controllers/login.controller');
const register = require('../controllers/register.controller');
const authMiddleware = require('../middlewares/auth.middleware');
//them boi dung tk
const forgotPassword = require("../controllers/forgotPassword.controller")
//

module.exports = app => {
    var router = require('express').Router();

    router.get('/login', authMiddleware.isAuth, login.showLoginForm)
    .post('/login', login.login)

    .get('/register', authMiddleware.isAuth, register.create)
    .post('/register', register.register)

    .get('/logout', authMiddleware.loggedin, login.logout)

    //them boi dungtk
    .get('/password/reset', forgotPassword.showForgotForm)
    .post('/password/email', forgotPassword.sendResetLinkEmail)
    
    .get('/password/reset/:email', forgotPassword.showResetForm)
    .post('/password/reset', forgotPassword.reset)
    //
    app.use(router);
}