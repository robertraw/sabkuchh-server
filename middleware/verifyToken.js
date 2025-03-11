 //Authentication Middleware for JWT validation
 import jwt from  'jsonwebtoken'

 export const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const tokenWithoutBearer = token.replace('Bearer ', '');
  jwt.verify(tokenWithoutBearer, process.env.SECRET, (err, decoded) => {
    if (err) {
      console.error(err)
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.user = decoded;
    req.user.stocks=req.body;
    next();
  });
};