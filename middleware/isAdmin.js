// Middleware para verificar el rol de administrador
const isAdmin = (req, res, next) => {
    if (req.user.role === 'admin') {
      next(); // Permite el acceso a la ruta
    } else {
      res.status(403).json({ message: 'Acceso denegado' });
    }
  };

  module.exports = isAdmin;