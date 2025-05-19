const { generateToken } = require("../config/jwt");
const { comparePassword } = require("../helpers/authHelpers");
const User = require("../model/User");

exports.login = async(req, res) => {
    const { email , password } = req.body;

    try {
  
      //validation
      if(!email || !password){
        return res.status(404).send({
            succes: false,
            message: 'Invalid email or password'
        });
    }
      // Buscar al usuario en la base de datos por su nombre de usuario
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(401).json({ 
          success: false,
          message: 'Email is not registerd'
         });
      }
  
      // Comparar la contraseña proporcionada con la almacenada en la base de datos
      const isPasswordValid = await comparePassword(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid Password'
         });
      }
  
      // Si las credenciales son válidas, genera un token JWT y envíalo en la respuesta
      const token = generateToken(user);
      res.json({
        success: true,
        message: 'login successfully',
        user,
        token });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Error en el servidor' });
    }
}