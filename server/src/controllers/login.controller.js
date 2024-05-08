let db = require("../models/index");
import bcrypt, { hash } from "bcryptjs"; // dung de hash password
import { where } from "sequelize";
const salt = bcrypt.genSaltSync(10);

exports.showLoginForm = (req, res) => {
  res.render('auth/login');
}

exports.login = async (req, res) => {
  
  const {email, password} = req.body
  console.log(req.body)
  // console.log(email + password)
  if (email && password) {
    let user = await db.User.findOne({
      where: { email: email },
      raw: true,
    });
    if (!user) {
      const conflictErr = "Email are not valid" 
      res.render('auth/login', { email, password, conflictErr });
    } 
    bcrypt.compare(password, user.password, (err, result) => {
      if (result == true) {
          req.session.loggedin = true;
          req.session.user = user;
          res.redirect('/');
      } else {
          // A user with that email address does not exists
          const conflictError = 'Wrong Password';
          res.render('auth/login', { email, password, conflictErr });
      }
  })
  } else {
    console.log("loi cmnr")
    const conflictErr = "User credentials are not valid."
    res.render('auth/login', {email, password, conflictErr})
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