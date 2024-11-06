const { User } = require('../model/User');
const crypto = require('crypto');
const { sanitizeUser } = require('../services/common');
const SECRET_KEY = 'SECRET_KEY';
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
  try {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      'sha256',
      async function (err, hashedPassword) {
        const user = new User({ ...req.body, password: hashedPassword, salt });
        const doc = await user.save();

        req.login(sanitizeUser(doc), (err) => {
          // this also calls serializer and adds to session
          if (err) {
            console.log("pass1")
            res.status(400).json(err);
          } else {
            const token = jwt.sign(sanitizeUser(doc), SECRET_KEY);
            console.log("pass2",token)
            doc.token=token;
            res
              .cookie('jwt', token, {
                expires: new Date(Date.now() + 3600000),
                httpOnly: true,
              })
              .status(201)
              .json({id:doc.id, role:doc.role});
          }
        });
      }
    );
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.loginUser = async (req, res) => {
  console.log("kkkkkkkkkkkkkkkkkkkkkkk",req.user,"iiiiiiiiiiiiiiiiiiiiiiii")
  res
    .cookie('jwt', req.user.token, {
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
      sameSite:'None'
    })
    .status(201)
    .json(req.user.token);
};


exports.logout = async (req, res) => {
  console.log("singout called")
  res
  .cookie('jwt', '', { 
    expires: new Date(Date.now()), 
    httpOnly: true, 
    path: '/', 
  })
  .sendStatus(200); // Send a 200 OK response
};

exports.checkAuth = async (req, res) => {
  // console.log("first this is from auth backend kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",req,"llllllllllllllllll")
    if(req.user){
      res.json(req.user);
    } else{
      res.sendStatus(401);
    }
}