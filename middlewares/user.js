const Users = require('../models/Users');

exports.userById = async (req, res, next, id) => {
    try {
        const user = await Users.findById(id);

        if (!user) {
            return res.status(400).json({ msg: 'Usuario no encontrado.' });
        }

        next();
    } catch (error) {
        res.status(400).json({ msg: 'ID no válido.' });
    }
}