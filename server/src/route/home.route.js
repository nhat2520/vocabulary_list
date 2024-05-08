const session = require('express-session')
const authMiddleware = require('../middlewares/auth.middleware')
let {handleChatGPTtext} = require("../controllers/appController")

module.exports = app => {
    var route = require('express').Router()
    
    route.get('/',authMiddleware.loggedin, (req, res) => {
        const firstName = req.session.user.firstName
        const lastName = req.session.user.lastName
        res.render('index', {firstName, lastName} ) 
    }) 

    // Route xử lý POST
    route.post('/', authMiddleware.loggedin, (req, res) => {  
        try {
            console.log(req.body);
            req.session.user.data = {
                body: req.body, // hoặc bất kỳ thông tin cụ thể nào khác bạn cần
            };
            res.redirect('/results');
        } catch (error) {
            console.error('Error handling ChatGPT text:', error);
            res.status(500).send('Server Error');
        }
    });
    
    route.get('/results', authMiddleware.loggedin, handleChatGPTtext)

    route.post('/results', authMiddleware.loggedin, (req, res) => {
        console.log("hello ")
        res.redirect('/')
    })

    app.use(route)
}