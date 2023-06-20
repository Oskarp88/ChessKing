const express = require('express');
const userRouter = express.Router();
const { verifyToken } = require('../config/jwt');
const User = require('../model/User');
const Game = require('../model/Game');
const isAdmin = require('../middleware/isAdmin');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { hashPassword } = require('../helpers/authHelpers.js');
const crypto = require('crypto');

require('dotenv').config();



// Obtener todos los usuarios (solo para administradores)
userRouter.get('/users', isAdmin, (req, res) => {

  User.find({}, '-password') // Excluye el campo de contraseña en la respuesta
    .then(users => {
      res.json(users);
    })
    .catch(error => {
      res.status(500).json({ message: 'Error al obtener usuarios' });
    });
});

userRouter.post('/user', async (req, res) => {
  const {
    name, 
    lastName,
    username, 
    email, 
    password,  
    country,
    
} = req.body;
//validations

  try {
    
    if(!name){
        return res.send({message: 'Name is Required'})
    }
    if(!email){
        return res.send({message: 'Email is Required'})
    }
    if(!password){
        return res.send({message: 'Password is Required'})
    }
    if(!username){
        return res.send({message: 'username is Required'})
    }
    if(!lastName){
        return res.send({message: 'lastName is Required'})
    }
    if(!country){
        return res.send({message: 'Country is Required'})
    }

    //check user
    const existingUser = await User.findOne({email})

    //existing user
    if(existingUser){
       return res.status(200).send({
        success: false,
        message: 'Already Register please login'
       })
    }

    //register user
    const hashedPassword = await hashPassword(password);
    //save
    const user = await new User({
      name,
      lastName,
      username,
      email,
      password:hashedPassword,
      country
    }).save();

    res.status(201).send({
        success: true,
        message: 'User Register Successfully',
        user: JSON.stringify(req.body), // Convertir a cadena JSON
    })
} catch (error) {
    console.log(error);
    res.status(500).send({
        success: false,
        message: 'Error in Register',
        error
    })
}
});

// Ruta para el proceso de olvido de contraseña
userRouter.post('/user/forgot-password', async (req, res) => {
  const { email } = req.body;
  console.log(Error);
  try {
    // Verificar si el correo electrónico existe en la base de datos
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'No se encontró un usuario con ese correo electrónico', token });
    }

       // Generar un token único y establecer la fecha de expiración (10 minutos)
       const token = crypto.randomBytes(20).toString('hex');
       const expirationDate = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos
   
       // Actualizar el usuario en la base de datos con el token y la fecha de expiración
       user.resetToken = token;
       user.resetTokenExpiration = expirationDate;
       await user.save();

    const transporter = nodemailer.createTransport({
      // Configura aquí tus credenciales de correo electrónico
      service: 'gmail',
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.MY_EMAIL,
      to: email,
      subject: 'Restablecer contraseña',
      text: `Haz clic en el siguiente enlace para restablecer tu contraseña: http://localhost:3000/reset-password/${token}`, 
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Correo electrónico enviado con éxito', token });
  } catch (error) {
    console.error('Error al enviar el correo electrónico:', error);
    res.status(500).json({ error: 'Error al enviar el correo electrónico' });
  }
});

// Ruta para el proceso de restablecimiento de contraseña
userRouter.post('/user/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
     // Buscar al usuario en la base de datos por el token y la fecha de expiración
     const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }
     
    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiration = null;
    await user.save();

    res.status(200).json({ message: 'Contraseña restablecida con éxito' });
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);
    res.status(500).json({ error: 'Error al restablecer la contraseña' });
  }
});

// Actualizar el rol de un usuario (solo para administradores)
userRouter.put('admin/dashboard/users/:id', isAdmin, (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  User.findByIdAndUpdate(id, { role }, { new: true }) // Actualiza el rol y devuelve el documento actualizado
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.json(user);
    })
    .catch(error => {
      res.status(500).json({ message: 'Error al actualizar el usuario' });
    });
});

userRouter.put('/user/update/:id', async (req, res) => {
  const token = req.headers.authorization;
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ message: 'Acceso no autorizado' });
  }

  const { id: userId } = decoded;
  const { id } = req.params;
  const { username, email, password, country, profileImage } = req.body;

  if (userId !== id) {
    return res.status(403).json({ message: 'No tienes permiso para actualizar estos datos' });
  }

  try {
    // Verificar si el nombre de usuario o el correo electrónico ya están en uso por otros usuarios
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser && existingUser._id != id) {
      return res.status(409).json({ message: 'El nombre de usuario o correo electrónico ya está en uso' });
    }

    // Actualizar los datos del usuario
    const updates = { username, email, country, profileImage };
    if (password) {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt);
      updates.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el usuario' });
  }
});

// Borrar lógicamente un usuario (solo para administradores)
userRouter.delete('/users/:id', isAdmin, (req, res) => {
  const { id } = req.params;

  User.findByIdAndUpdate(id, { deleted: true }, { new: true }) // Actualiza el campo "deleted" a true y devuelve el documento actualizado
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.json(user);
    })
    .catch(error => {
      res.status(500).json({ message: 'Error al borrar el usuario' });
    });
});


// Obtener estadísticas de un jugador específico
userRouter.get('/users/:id/stats', (req, res) => {
    const { id } = req.params;
  
    User.findById(id)
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: 'Usuario no encontrado' });
        }
  
        const { gamesWon, gamesLost, gamesTied } = user;
  
        res.json({ gamesWon, gamesLost, gamesTied });
      })
      .catch(error => {
        res.status(500).json({ message: 'Error al obtener las estadísticas del jugador' });
      });
  });
  
  // Obtener el ranking de jugadores ordenado por puntaje (de mayor a menor)
  userRouter.get('/users/ranking', (req, res) => {
    User.find({}, '-password')
      .sort({ score: -1 })
      .then(users => {
        res.json(users);
      })
      .catch(error => {
        res.status(500).json({ message: 'Error al obtener el ranking' });
      });
  });

  // Obtener el historial de partidas de un jugador
userRouter.get('/users/:id/games', (req, res) => {
    const { id } = req.params;
  
    Game.find({ $or: [{ player1: id }, { player2: id }] })
      .populate('player1', 'username')
      .populate('player2', 'username')
      .then(games => {
        res.json(games);
      })
      .catch(error => {
        res.status(500).json({ message: 'Error al obtener el historial de partidas' });
      });
  });
  
  // Ruta de administración accesible solo para administradores
userRouter.get('/admin/dashboard', isAdmin, (req, res) => {
    User.find({}, '-password')
    .then(users => {
      res.json(users);
    })
    .catch(error => {
      res.status(500).json({ message: 'Error al obtener los usuarios' });
    });
  });

  // Actualizar el rol de un usuario a administrador (solo para administradores)
userRouter.put('/admin/users/:id/admin', isAdmin, (req, res) => {
    const { id } = req.params;
  
    User.findByIdAndUpdate(id, { role: 'admin' })
      .then(() => {
        res.json({ message: 'Rol de usuario actualizado a administrador' });
      })
      .catch(error => {
        res.status(500).json({ message: 'Error al actualizar el rol de usuario' });
      });
  });


  // Banear a un usuario (solo para administradores)
userRouter.put('/admin/users/:id/ban', isAdmin, (req, res) => {
    const { id } = req.params;
  
    User.findByIdAndUpdate(id, { isBanned: true })
      .then(() => {
        res.json({ message: 'Usuario baneado correctamente' });
      })
      .catch(error => {
        res.status(500).json({ message: 'Error al banear al usuario' });
      });
  });
  

module.exports = userRouter;
