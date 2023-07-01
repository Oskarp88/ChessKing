const jwt = require('jsonwebtoken');

 // Cambia esto con una clave segura en un entorno de producción

function generateToken(user) {
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.SECRETA_JWT, { expiresIn: '1h' });
  return token;
}

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.SECRETA_JWT);
    return decoded;
  } catch (error) {
    return null;
  }
}

module.exports = { generateToken, verifyToken };
