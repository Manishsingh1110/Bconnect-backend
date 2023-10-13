
var jwt = require('jsonwebtoken');
const JWT_SECRET = 'bconnect';

const fetchuser=(req, res,next) => {
    const token=req.header('auth-token');
    if (!token) {
        return res.status(400).json({ errors:"please login"});
      }
    try {
        const data=jwt.verify(token,JWT_SECRET)
        req.user=data.user;
        next();
    } catch (err) {
      res.json([{ errors:'please enter a valid email', message: err.message}])
    }
  }
  module.exports=fetchuser