let db = require("../models/index");
import bcrypt, { hash } from "bcryptjs"; // dung de hash password
import { where } from "sequelize";
const salt = bcrypt.genSaltSync(10);

exports.showLoginForm = (req, res) => {
  res.render('auth/login');
}

exports.login = async (req, res) => {
  
  const {email, password} = req.body
  // console.log(email + password)
  let user = await db.User.findOne({
    where: { email: email },
    raw: true,
  });
  if (user == null) {
    const emailErr = "Email are not valid" 
    res.render('auth/login', { email, password, emailErr });
  } else {
    bcrypt.compare(password, user.password, (err, result) => {
        if (result == true) {
            req.session.loggedin = true;
            req.session.user = user;
            res.redirect('/');
        } else {
            // A user with that email address does not exists
            const pswErr = "The password that you've entered is incorrect.";
            res.render('auth/login', {pswErr});
        }
    })
  }
}

let checkUserEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: {
          email: userEmail,
        },
      });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) res.redirect('/500')
    res.redirect('/login')
  })
}