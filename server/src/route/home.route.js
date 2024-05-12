const session = require('express-session')
const authMiddleware = require('../middlewares/auth.middleware')
let {handleChatGPTtext, handleChatGPTsubtitle, handleChatGPTpdf, handleSaveData, handleGetAllConversation } = require("../controllers/appController")
const { request } = require('express')
const multer = require('multer');

module.exports = app => {
    var route = require('express').Router()
    //Xử lý file
    const storage = multer.diskStorage({
    destination: (req, file, cb) => {
    cb(null, 'uploads/');
    }, 
    filename: (req, file, cb) => {
    cb(null, file.originalname);
    }
});
const upload = multer({ storage });

    route.get('/',authMiddleware.loggedin, async (req, res) => {
        const firstName = req.session.user.firstName
        const lastName = req.session.user.lastName
        const conversations = await handleGetAllConversation(req, res)

        res.render('index', {firstName, lastName, conversations} ) 
    }) 

    // route.post('/', authMiddleware.loggedin,upload.single('file'), handleChatGPTpdf)

    route.post('/', authMiddleware.loggedin ,upload.single('file'), async (req, res) => {  
        try {
            //render text luôn để giảm tải logic xử lý, chuyển text đó sang hàm handleChatGPTtext
            if (req.file) {
                req.body.text = await handleChatGPTpdf(req, res)
            }
            console.log(req.body)
            req.session.user.data = {
                body: req.body,
            };
            res.redirect('/results');
        } catch (error) {
            console.error('Error handling ChatGPT text:', error);
            res.status(500).send('Server Error');
        }
    });
    
    route.get('/results', authMiddleware.loggedin, async function(req, res) {
        var request = req.session.user.data.body
        if (request.text != '') {
            handleChatGPTtext(req, res)
        } else if (request.url != '') {
            handleChatGPTsubtitle(req, res)
        }
    })

    route.post('/results', authMiddleware.loggedin, (req, res) => {
        console.log(req.body)
        const cancel_btn = req.body.cancel_btn
        const save_btn = req.body.cancel_btn
        if(cancel_btn != null) {
            console.log("cancel")
            res.redirect('/')
        } else {
            handleSaveData(req, res)
        }
    })
 
    route.get('/history/:id', authMiddleware.loggedin, function (req, res) {
        const id = req.params.id;
        
        res.send(`Đây là id: ${id}`);
      });

    app.use(route)
}