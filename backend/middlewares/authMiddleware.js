const jwt=require('jsonwebtoken')
const User=require("./../Models/userModel")
const asycHandler=require("express-async-handler");
const { route } = require('../routes/userRoutes');

const protect = asycHandler(async (req, res ,next)=> {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
      
    try {
        //Bearer adbfjbajadfa    ->here we are just spliting a token 
        token=req.headers.authorization.split(" ")[1]

        const decoded=jwt.verify(token,process.env.JWT_SECRET);

        req.user=await User.findById(decoded.id).select("-password")
        next()
    } catch (error) {
        res.status(401);
        throw new Error("Not authorization, no token")
    }
      
  }
  if (!token) {
    res.status(401);
    throw new Error("Not authorization, no token");
  }
});

module.exports={protect}