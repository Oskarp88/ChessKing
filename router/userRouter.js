const express = require('express');
const { 
  getUser, 
  getAllUser, 
  protectedUser, 
  createUser, 
  forgotPassword, 
  resetPassword, 
  roleUser, 
  updateUser, 
  statsUser, 
  deleteUser, 
  userElo, 
  getUserBandera, 
  getRatingBlitz,
  getRatingBullet,
  getAllFrames,
  getAllAvatars,
  postUserExist,
  getRatingRapid,
  getRatingClassical,
  leagueResults} = require('../controllers/userController');
const { requireSignIn, isAdmin } = require('../middleware/isAdmin');
const userRouter = express.Router();

userRouter.get('/user/:id', getUser);
userRouter.get('/users', getAllUser);
userRouter.get('/user-auth', requireSignIn, protectedUser);
userRouter.post('/userExist', postUserExist);
userRouter.post('/user', createUser);
userRouter.post('/user/forgot-password', forgotPassword);
userRouter.post('/user/reset-password', resetPassword);
userRouter.put('admin/dashboard/users/:id', isAdmin, roleUser);
// userRouter.get('/user-photo/:pid',photoUser);
userRouter.get('/user-bandera/:pid',getUserBandera);
userRouter.put('/user/update/:userId', updateUser);
userRouter.delete('/users/:id', isAdmin, deleteUser);
userRouter.get('/users/:id/stats', statsUser);
userRouter.get('/users/:id/elo', userElo);
userRouter.get('/users/rating-classical', getRatingClassical);
userRouter.get('/users/rating-rapid', getRatingRapid);
userRouter.get('/users/rating-blitz', getRatingBlitz);
userRouter.get('/users/rating-bullet', getRatingBullet);
  
  // Ruta de administración accesible solo para administradores
userRouter.get('/admin/dashboard',requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ok: true});   
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
