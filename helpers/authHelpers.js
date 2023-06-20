const bcrypt = require('bcrypt');

const hashPassword = async(password) => {
    try {
        const saltRound = 10;
        const hashPasword = await bcrypt.hash(password, saltRound);
        return hashPasword;
    } catch (error) {
        console.log(error)
    }
}

const comparePassword = async (password, hashPasword) => {
    return bcrypt.compare(password, hashPasword);
}

module.exports = {
    hashPassword,
    comparePassword
}