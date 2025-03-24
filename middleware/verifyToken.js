 //Authentication Middleware for JWT validation
 import jwt from  'jsonwebtoken'

 export const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const tokenWithoutBearer = token.replace('Bearer ', '');
try{
  jwt.verify(tokenWithoutBearer, process.env.SECRET, (err, decoded) => {
    if (err) {
      console.error(err)
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.user = decoded;
    console.log(req.user)
    req.user.requestBody=req.body;
    next(); 
  });
}catch(error){
  console.error(error)
  return res.status(500).json({ error: 'Internal server error' });
} 
};