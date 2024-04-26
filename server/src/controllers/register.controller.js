let db = require("../models/index");
import bcrypt, { hash } from "bcryptjs"; // dung de hash password
import { where } from "sequelize";
const salt = bcrypt.genSaltSync(10);

exports.create = async (req, res) => {
  res.render('auth/register')
}

exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    console.log(password)
    if (!email || !password || !firstName || !lastName) {
      const missingFieldsErr = "Missing required fields.";
      console.log('opps, err')
      return res.status(400).render('auth/register', { 
        email, 
        password, 
        firstName, 
        lastName, 
        errorMessage: missingFieldsErr 
      });
    }

    const userExists = await checkUserEmail(email);
    if (userExists) {
      const emailErr = "User credentials already exist.";
      return res.status(409).render('auth/register', { 
        email, 
        password, 
        firstName, 
        lastName, 
        emailErr
      });
    }

    const hashPasswordFromBcrypt = await hashUserPassword(password);
    await db.User.create({
      email: email,
      password: hashPasswordFromBcrypt,
      firstName: firstName,
      lastName: lastName,
    });

    console.log("User created successfully");
    res.redirect('/login');
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).render('auth/register', { 
      email, 
      password, 
      firstName, 
      lastName, 
      errorMessage: "An error occurred. Please try again." 
    });
  }
};


let checkUserEmail = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: {
          email: email,
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


let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};