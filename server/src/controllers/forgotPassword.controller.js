const bcrypt = require("bcryptjs");
const mailer = require('../utils/mailer')
const db = require("../models/index");

exports.showForgotForm = (req, res) => {
  let message = "";
  res.render("auth/forgot_password/email", {message:message});
};

exports.sendResetLinkEmail = async(req, res) => {
    if(!req.body.email) {
        res.redirect('/password/reset')
    } else {
        let user = await db.User.findOne({
            where: {email: req.body.email}
        });
        console.log(user);
        let message = ""
        if(!user) {
            message = "Email không tồn tại !"
            res.render('auth/forgot_password/email', {message:message})
        } else {
            bcrypt.hash(user.email, parseInt(process.env.BRYPT_SALT_ROUND)).then((hashEmail)=>{
                console.log(`${process.env.APP_URL}/password/reset/${user.email}&token=${hashEmail}`);
                mailer.sendMail(user.email, "Reset password", `<a href="${process.env.APP_URL}/password/reset/${user.email}?token=${hashEmail}"> Reset password </a>`)
              })
            message = "Thành công, kiểm tra email để reset password của bạn !"
            res.render('auth/forgot_password/email', {message: message})
        }
    }
}

exports.showResetForm = (req, res) => {
    if(!req.params.email || !req.query.token) {
        res.redirect('/password/reset');
    }else {
        console.log("loo")
        res.render('auth/forgot_password/reset', {email: req.params.email, token: req.query.token})
    }
}


exports.reset = (req, res) => {
    const {email, token, password} = req.body;
    console.log(email, token, password);
    if(!email || !token || !password) {
        res.redirect('/password/reset');
    } else {
        bcrypt.compare(email, token, (err, result) => {
            console.log('compare', result);
            if(result == true) {
                
                bcrypt.hash(password, parseInt(process.env.BRYPT_SALT_ROUND)).then(async(hashPassword) => {
                    let user = await db.User.findOne({
                        where: {email: email}
                    })
                    
                    if(user) {
                        
                        let updateUser = await user.update({
                            password: hashPassword,
                        })
                        console.log(updateUser);
                        if(updateUser) {
                            res.redirect('/login');
                        }else {
                            res.send('loi cmnr')
                        }
                    }
                })
            } else {
                res.redirect('/password/reset');
            }
        })
    }
  
  }
  
  

