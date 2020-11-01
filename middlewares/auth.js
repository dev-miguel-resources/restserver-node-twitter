const Users = require('../models/Users');
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    const bearerToken = req.header('Authorization');

    if (!bearerToken) {
        return res.status(401).json({ msg: 'Permiso no válido' });
    }

    try {
        const token = bearerToken.split(' ')[1];
        const authUser = jwt.verify(token, process.env.SECRET);
        const user = await Users.findById(authUser._id);
        
        if (!user) {
            return res.status(401).json({ msg: 'El usuario no existe' });
        }
        
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ msg: 'Token no válido' });
    }
}