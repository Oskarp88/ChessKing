const express = require('express');
const authRouter = express.Router();
const { generateToken, verifyToken } = require('../config/jwt');
const passport = require('passport');
const User = require('../model/User');
const { comparePassword } = require('../helpers/authHelpers');

// const User = require('../model/User');

// Ruta de login
authRouter.post('/login', async (req, res) => {
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
});
// Ruta protegida de ejemplo
authRouter.get('/protected', (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ message: 'Token inválido' });
  }

  // Si el token es válido, puedes acceder a los datos del usuario desde `decoded`
  res.json({ message: 'Ruta protegida', user: decoded });
});


// Ruta de autenticación de Google
authRouter.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Ruta de callback de Google para obtener los datos del usuario
authRouter.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  // Aquí puedes redirigir al usuario a la página principal o hacer cualquier otra acción necesaria
  res.redirect('/');
});

// Ruta de autenticación de Facebook
authRouter.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

// Ruta de callback de Facebook para obtener los datos del usuario
authRouter.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
  // Aquí puedes redirigir al usuario a la página principal o hacer cualquier otra acción necesaria
  res.redirect('/');
});

// Estrategia de autenticación de Google
// passport.use(new GoogleStrategy({
//     clientID: GOOGLE_CLIENT_ID,
//     clientSecret: GOOGLE_CLIENT_SECRET,
//     callbackURL: '/auth/google/callback'
//   },
//   (accessToken, refreshToken, profile, done) => {
//     // Aquí puedes guardar los datos del usuario en la base de datos o realizar cualquier acción necesaria
//     User.findOne({ googleId: profile.id })
//       .then(existingUser => {
//         if (existingUser) {
//           return done(null, existingUser);
//         }
        
//         const newUser = new User({
//           googleId: profile.id,
//           username: profile.displayName
//         });

//         newUser.save()
//           .then(user => {
//             done(null, user);
//           })
//           .catch(error => {
//             done(error, null);
//           });
//       })
//       .catch(error => {
//         done(error, null);
//       });
//   }
// ));

// // Estrategia de autenticación de Facebook
// passport.use(new FacebookStrategy({
//     clientID: FACEBOOK_CLIENT_ID,
//     clientSecret: FACEBOOK_CLIENT_SECRET,
//     callbackURL: '/auth/facebook/callback',
//     profileFields: ['id', 'displayName', 'email']
//   },
//   (accessToken, refreshToken, profile, done) => {
//     // Aquí puedes guardar los datos del usuario en la base de datos o realizar cualquier acción necesaria
//     User.findOne({ facebookId: profile.id })
//       .then(existingUser => {
//         if (existingUser) {
//           return done(null, existingUser);
//         }
        
//         const newUser = new User({
//           facebookId: profile.id,
//           username: profile.displayName
//         });

//         newUser.save()
//           .then(user => {
//             done(null, user);
//           })
//           .catch(error => {
//             done(error, null);
//           });
//       })
//       .catch(error => {
//         done(error, null);
//       });
//   }
// ));


module.exports = authRouter;
