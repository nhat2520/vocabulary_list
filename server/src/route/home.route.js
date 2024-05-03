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
    route.post('/', authMiddleware.loggedin,(req, res) => {
        const { firstName, lastName } = req.session.user;
        try {
            const results = handleChatGPTtext(req);
            // // Lưu kết quả vào session hoặc một nơi tạm thời
            req.session.results = results;
            // Chuyển hướng đến route GET để hiển thị kết quả
            res.redirect('/results')
        } catch (error) {
            console.error('Error handling ChatGPT text:', error);
            res.status(500).send('Server Error');
        }
    });

    // Route xử lý GET để hiển thị kết quả
    route.get('/results', authMiddleware.loggedin, (req, res) => {
        // Lấy kết quả từ session hoặc nơi tạm thời
        const { firstName, lastName } = req.session.user;
        const results = req.session.results;
        // Hiển thị view với kết quả
        res.render('index', { firstName, lastName});
    });

    app.use(route)
}