const passport = require('passport');

exports.isAuth = (req, res, done) => {
  // console.log("first this is from auth backend kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",req,"llllllllllllllllll")
    return passport.authenticate('jwt');
};

exports.sanitizeUser = (user) => {
  console.log(user,"sanitiseuser")
    return { id: user.id, role: user.role,token:user.token };
  };
  
  exports.cookieExtractor = function (req) {

    console.log("cookie extracted",req.cookies)

    let token = null;
    if (req&&req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    else if(req && req.headers && req.headers.authorization)
    {
      const authHeader = req.headers.authorization;
      token = authHeader.split(' ')[1]; 
    }
    console.log("commonjs",token)
    //TODO : this is temporary token for testing without cookie
    // token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NTgzNjg2NzYxZmE0MWQ1YThjYzA1NyIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzE3MDU3MTU4fQ.ipjgfJbVuE4NhQuF-A7B7hZcEubetq37r84taJtA44A"
  return token;
  };
