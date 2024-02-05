const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // console.log(req.cookies);
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(403).send('Access denied.');
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).send('Invalid Token');
  }
};

module.exports = verifyToken;