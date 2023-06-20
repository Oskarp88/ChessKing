const jwt = require('jsonwebtoken');

const secretKey = 'TuClaveSecreta'; // Cambia esto con una clave segura en un entorno de producción

function generateToken(user) {
  const token = jwt.sign({ id: user.id, role: user.role }, secretKey, { expiresIn: '1h' });
  return token;
}

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    return null;
  }
}

module.exports = { generateToken, verifyToken };
