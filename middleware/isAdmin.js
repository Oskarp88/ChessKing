const JWT  = require("jsonwebtoken");
const User = require("../model/User");

// Middleware para verificar el rol de administrador
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if(user.role === 'admin'){
         next();
    }else{        
        return res.status(401).send({
          success: false,
          message: 'UnAuthorized Access'
      });
    }
} catch (error) {
    console.log(error);
    res.status(401).send({
        success: false,
        error,
        message: "Error in admin middelware",
    })
}
  };

   const requireSignIn = async(req, res, next) => {
    try {
        const decode =   JWT.verify(req.headers.authorization, process.env.SECRETA_JWT);
        req.user = decode;
        next();
        
    } catch (error) {
        console.log(error)
    }
}
  module.exports = {
    isAdmin, 
    requireSignIn
  };