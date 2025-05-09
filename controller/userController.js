const User = require('../model/User');
const nodemailer = require('nodemailer');
const { hashPassword } = require('../helpers/authHelpers.js');
const crypto = require('crypto');
const userService = require('../service/userService.js');

require('dotenv').config();
   
exports.getUser = async(req, res) => {
  try {
    const id = req.params.id;
    const user = await userService.getUser(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }  
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

exports.postUserExist = async (req, res) => {
  try {
    const{ email} = req.body;

    // Validar que el email no sea undefined o null
    if (!email) {
      return res.status(400).json({ message: 'email parameter is required' });
    }

    // Buscar usuario en la base de datos
    const user = await userService.getUserFind(email);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error en getUserExist:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


exports.getUserBandera = async(req, res) => {
  try {
    const userId = req.params.id;
    const user = await userService.getUser(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).send(user.flags);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

exports.getAllUser = async(req, res) => {
    try {
        const users = await userService.getUsers(); 
        res.json(users);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener usuarios' });
      }
}

exports.protectedUser = (req, res) => {
    console.log('estas autoriazdo')
    res.status(200).send({ok: true});
}

exports.createUser = async(req, res) => {
    const {
        name, 
        lastName,
        username, 
        email, 
        password,  
        country,
        imagenBandera
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
        const existingUser = await userService.getUserFind({email})
    
        //existing user
        if(existingUser){
          throw new Error('Already Register please login');
        }
    
        //register user
        const hashedPassword = await hashPassword(password);
        //save
         await userService.createUser({
          name,
          lastName,
          username,
          email,
          flags,
          password:hashedPassword,
          role: 'user',     
          country,
        });
    
        res.status(201).send({
            success: true,
            message: 'User Register Successfully',
            user: JSON.stringify(req.body), // Convertir a cadena JSON
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error in Register',
            error
        });
    }
}

exports.updateUser = async (req, res) => {
  const { userId } = req.params; // Obtén el ID del usuario desde los parámetros de la ruta
  const { name, lastName, username, country, photo, imagenBandera, marco } = req.body;

  try {
    const user = await userService.getUser(userId); // Encuentra el usuario por su ID en la base de datos

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Si el username es diferente al actual, verificar si ya existe en otro usuario
    if (username && username !== user.username) {
      const existingUser = await userService.getUserFind({username});
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'El nombre de usuario ya está en uso. Por favor elige otro.',
        });
      }
    }

    // Actualiza los campos del usuario con los nuevos valores proporcionados
    const userUpdate = await userService.updateUser(
      userId,
      {
        name: name || user.name,
        lastName: lastName || user.lastName,
        username: username || user.username,
        country: country || user.country,
        photo: photo || user.photo,
        imagenBandera: imagenBandera || user.imagenBandera,
        marco: marco || user.marco,
      },// Devuelve el usuario actualizado
    );

    res.send({
      success: true,
      message: 'Datos de usuario actualizados correctamente',
      userUpdate,
    });
  } catch (error) {
    console.error('Error:', error);

    res.status(500).json({ message: 'Error al actualizar el usuario' });
  }
};


exports.deleteUser = async(req, res) => {
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
}

exports.forgotPassword = async(req, res) => {
    const { email } = req.body;
  try {
    // Verificar si el correo electrónico existe en la base de datos
    const user = await userService.getUserFind(email);

    if (!user) {
      return res.status(404).json({ error: 'No se encontró un usuario con ese correo electrónico'});
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
      text: `Haz clic en el siguiente enlace para restablecer tu contraseña: https://chessknight.vercel.app/reset-password/${token}`, 
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Correo electrónico enviado con éxito', token });
  } catch (error) {
    console.error('Error al enviar el correo electrónico:', error);
    res.status(500).json({ error: 'Error al enviar el correo electrónico' });
  }
}

exports.resetPassword = async(req, res) =>{
    const { token, newPassword } = req.body;

    try {
       // Buscar al usuario en la base de datos por el token y la fecha de expiración
       const user = await User.findOne({
        resetToken: token,
        resetTokenExpiration: { $gt: Date.now() },
      });
  
      if (!user) {
        return res.status(400).json({success: false, message: 'Token inválido o expirado. Por favor vuelve a enviar nueva mente tu correo. Tienes solo 10 minutos para cambiar tu contraseña antes que expire el token de seguridad.' });
      }
       
      const hashedPassword = await hashPassword(newPassword);
      user.password = hashedPassword;
      user.resetToken = null;
      user.resetTokenExpiration = null;
      await user.save();
  
      res.status(200).json({success: true, message: 'Contraseña restablecida con éxito' });
    } catch (error) {
      console.error('Error al restablecer la contraseña:', error);
      res.status(500).json({ success: false, message: 'Error al restablecer la contraseña' });
    }
}

exports.roleUser = async(req, res) =>{
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
}

// exports.photoUser = async(req, res) => {
//     try {
//         const user = await User.findById(req.params.pid).select('photo');
        
//         if(user.photo.data){
//             res.set('Content-type', user.photo.contentType)
//             return res.status(200).send(user.photo.data);
//         }else{
//           res.status(404).json({ error: 'Imagen no encontrada' });
//         }
//     } catch (error) {
//         console.log('error en la imagen');
//         res.status(500).send({
//             success:false,
//             message: 'Error while getting photo',
//             error
//         })
//     }
// }

// Obtener estadísticas de un jugador específico
exports.statsUser = async(req, res) => {
    const { id } = req.params;
  
    User.findById(id, '-password -photo -partida').then(user => {
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const {
             games,
             gamesWon, 
             gamesLost, 
             gamesTied,
             gamesBullet,
             gamesWonBullet,
             gamesLostBullet,
             gamesTiedBullet,
             gamesBlitz,
             gamesWonBlitz,
             gamesLostBlitz,
             gamesTiedBlitz,
             gamesFast,
             gamesWonFast,
             gamesLostFast,
             gamesTiedFast
        } = user;

        res.json({ 
            games,
             gamesWon, 
             gamesLost, 
             gamesTied,
             gamesBullet,
             gamesWonBullet,
             gamesLostBullet,
             gamesTiedBullet,
             gamesBlitz,
             gamesWonBlitz,
             gamesLostBlitz,
             gamesTiedBlitz,
             gamesFast,
             gamesWonFast,
             gamesLostFast,
             gamesTiedFast
         });
        })
        .catch(error => {
        res.status(500).json({ message: 'Error al obtener las estadísticas del jugador' });
    });
}

//obtener el elo 
exports.userElo = async(req, res) => {
  const { id } = req.params;
  console.log('eloId', id)
  User.findById(id, '-password -photo -partida').then(user => {
      if (!user) {
          return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      const {
           eloBullet,
           eloBlitz,
           eloFast     
     } = user;

      res.json({ 
          eloBullet,
          eloBlitz,
          eloFast
       });
      })
      .catch(error => {
      res.status(500).json({ message: 'Error al obtener el elo del jugador'});
  });
}

exports.getRatingRapid = async (req, res) => {
  try {
    // Buscar todos los usuarios
    const users = await userService.getUsers();
    
    // Separar los usuarios que tienen todos los valores en 0
    const usersWithZeroValues = users.filter(user => 
      user.eloRapid === 0 && 
      user.totalWonGamesRapid === 0 && 
      user.totalLostGamesRapid === 0 && 
      user.totalGamesRapid === 0
    );

    // Ordenar los usuarios que tienen al menos un valor distinto de 0
    const sortedUsers = users
      .filter(user => 
        user.eloRapid !== 0 || 
        user.totalWonGamesRapid !== 0 || 
        user.totalLostGamesRapid !== 0 || 
        user.totalGamesRapid !== 0
      ).sort((a, b) => {
        if (a.eloRapid !== b.eloRapid) {
          return b.eloRapid - a.eloRapid; // Ordenar por eloBlitz (mayor a menor)
        } else if (a.totalWonGamesRapid !== b.totalWonGamesRapid) {
          return b.totalWonGamesRapid - a.totalWonGamesRapid; // Ordenar por victorias (mayor a menor)
        } else if (a.totalLostGamesRapid !== b.totalLostGamesRapid) {
          return a.totalLostGamesRapid - b.totalLostGamesRapid; // Ordenar por derrotas (menor a mayor)
        } else {
          return a.totalGamesRapid - b.totalGamesRapid; // Ordenar por juegos totales (menor a mayor)
        }
      });

    // Combinar los usuarios ordenados con los usuarios que tienen todos los campos en 0 (estos irán al final)
    const finalUsers = [...sortedUsers, ...usersWithZeroValues];
    res.status(200).json(finalUsers);
  } catch (error) {
    console.error('Error al obtener el rating Rapid:', error);
    res.status(500).json({ message: 'Error al obtener el rating Rapid' });
  }
};

exports.getRatingBlitz = async (req, res) => {
  try {
    // Buscar todos los usuarios
    const users = await userService.getUsers();
    
    // Separar los usuarios que tienen todos los valores en 0
    const usersWithZeroValues = users.filter(user => 
      user.eloBlitz === 0 && 
      user.totalWonGamesBlitz === 0 && 
      user.totalLostGamesBlitz === 0 && 
      user.totalGamesBlitz === 0
    );

    // Ordenar los usuarios que tienen al menos un valor distinto de 0
    const sortedUsers = users
      .filter(user => 
        user.eloBlitz !== 0 || 
        user.totalWonGamesBlitz !== 0 || 
        user.totalLostGamesBlitz !== 0 || 
        user.totalGamesBlitz !== 0
      ).sort((a, b) => {
        if (a.eloBlitz !== b.eloBlitz) {
          return b.eloBlitz - a.eloBlitz; // Ordenar por eloBlitz (mayor a menor)
        } else if (a.totalWonGamesBlitz !== b.totalWonGamesBlitz) {
          return b.totalWonGamesBlitz - a.totalWonGamesBlitz; // Ordenar por victorias (mayor a menor)
        } else if (a.totalLostGamesBlitz !== b.totalLostGamesBlitz) {
          return a.totalLostGamesBlitz - b.totalLostGamesBlitz; // Ordenar por derrotas (menor a mayor)
        } else {
          return a.totalGamesBlitz - b.totalGamesBlitz; // Ordenar por juegos totales (menor a mayor)
        }
      });

    // Combinar los usuarios ordenados con los usuarios que tienen todos los campos en 0 (estos irán al final)
    const finalUsers = [...sortedUsers, ...usersWithZeroValues];
    res.status(200).json(finalUsers);
  } catch (error) {
    console.error('Error al obtener el rating Blitz:', error);
    res.status(500).json({ message: 'Error al obtener el rating Blitz' });
  }
};


exports.getRatingBullet = async (req, res) => {
  try {
    // Buscar todos los usuarios
    const users = await userService.getUsers(); 
    // Separar los usuarios que tienen todos los valores en 0
    const usersWithZeroValues = users.filter(user => 
      user.eloBullet === 0 && 
      user.totalWonGamesBullet === 0 && 
      user.totalLostGamesBullet === 0 && 
      user.totalGamesBullet === 0
    );

    // Ordenar los usuarios que tienen al menos un valor distinto de 0
    const sortedUsers = users
      .filter(user => 
        user.eloBullet !== 0 || 
        user.totalWonGamesBullet !== 0 || 
        user.totalLostGamesBullet !== 0 || 
        user.totalGamesBullet !== 0
      ).sort((a, b) => {
        if (a.eloBullet !== b.eloBullet) {
          return b.eloBullet - a.eloBullet; // Ordenar por eloBlitz (mayor a menor)
        } else if (a.totalWonGamesBullet !== b.totalWonGamesBullet) {
          return b.totalWonGamesBullet - a.totalWonGamesBullet; // Ordenar por victorias (mayor a menor)
        } else if (a.totalLostGamesBullet !== b.totalLostGamesBullet) {
          return a.totalLostGamesBullet - b.totalLostGamesBullet; // Ordenar por derrotas (menor a mayor)
        } else {
          return a.totalGamesBullet - b.totalGamesBullet; // Ordenar por juegos totales (menor a mayor)
        }
      });

    // Combinar los usuarios ordenados con los usuarios que tienen todos los campos en 0 (estos irán al final)
    const finalUsers = [...sortedUsers, ...usersWithZeroValues];
    res.status(200).json(finalUsers);
  } catch (error) {
    console.error('Error al obtener el rating Bullet:', error);
    res.status(500).json({ message: 'Error al obtener el rating Bullet' });
  }
};

exports.getRatingClassical = async (req, res) => {
  try {
    // Buscar todos los usuarios
    const users = await userService.getUsers(); 
    // Separar los usuarios que tienen todos los valores en 0
    const usersWithZeroValues = users.filter(user => 
      user.eloClassical === 0 && 
      user.totalWonGamesClassical === 0 && 
      user.totalLostGamesClassical === 0 && 
      user.totalGamesClassical === 0
    );

    // Ordenar los usuarios que tienen al menos un valor distinto de 0
    const sortedUsers = users
      .filter(user => 
        user.eloClassical !== 0 || 
        user.totalWonGamesClassical !== 0 || 
        user.totalLostGamesClassical !== 0 || 
        user.totalGamesClassical !== 0
      ).sort((a, b) => {
        if (a.eloClassical !== b.eloClassical) {
          return b.eloClassical - a.eloClassical; // Ordenar por eloBlitz (mayor a menor)
        } else if (a.totalWonGamesClassical !== b.totalWonGamesClassical) {
          return b.totalWonGamesClassical - a.totalWonGamesClassical; // Ordenar por victorias (mayor a menor)
        } else if (a.totalLostGamesClassical !== b.totalLostGamesClassical) {
          return a.totalLostGamesClassical - b.totalLostGamesClassical; // Ordenar por derrotas (menor a mayor)
        } else {
          return a.totalGamesClassical - b.totalGamesClassical; // Ordenar por juegos totales (menor a mayor)
        }
      });

    // Combinar los usuarios ordenados con los usuarios que tienen todos los campos en 0 (estos irán al final)
    const finalUsers = [...sortedUsers, ...usersWithZeroValues];
    res.status(200).json(finalUsers);
  } catch (error) {
    console.error('Error al obtener el rating Classical:', error);
    res.status(500).json({ message: 'Error al obtener el rating Classical' });
  }
};







