const Users = require('../models/Users');
const Relations = require('../models/Relations');

exports.listUser = (req, res) => {
    if (!req.query.page) {
        return res.status(400).json({ msg: 'Parámetro página no válido.' });
    }

    if (!Number.isInteger(parseInt(req.query.page))) {
        return res.status(400).json({ msg: 'Parámetro página debe ser un valor númerico.' });
    }

    if (parseInt(req.query.page) <= 0) {
        return res.status(400).json({ msg: 'Parámetro página debe ser mayor a 0.' });
    }

    const search = req.query.search || '';
    const type = req.query.type || 'new';
    const page = req.query.page;
    const userList = [];

    Users.find({
        $or: [
            { names: { $regex: `.*${search}.*`, $options: 'i' } },
            { surnames: { $regex: `.*${search}.*`, $options: 'i' } }
        ]
    })
        .skip((page - 1) * 10)
        .limit(10)
        .exec(async (err, users) => {
            if (err) {
                return res.status(500).json({ msg: 'Se ha producido un error. Por favor, inténtelo más tarde.' });
            }

            const promises = users.map(async user => {
                await Relations.findOne({ userId: req.user._id, userRelationId: user._id }, (err, relation) => {
                    if (err) {
                        return res.status(400).json({ msg: 'ID no válido.' });
                    }

                    let include = false;

                    if (type == 'new' && !relation) {
                        include = true;
                    }

                    if (type == 'follow' && relation) {
                        include = true;
                    }

                    if (String(req.user._id) == String(user._id)) {
                        include = false;
                    }

                    if (include) {
                        const userData = {
                            _id: user._id,
                            names: user.names,
                            surnames: user.surnames,
                            birthdate: user.birthdate
                        }

                        userList.push(userData);
                    }
                });
            });

            await Promise.all(promises);

            res.status(200).json(userList);
        });
}

exports.readProfile = (req, res) => {
    if (!req.query.id) {
        return res.status(400).json({ msg: 'Parámetro ID no válido' });
    }

    Users.findById(req.query.id, (err, user) => {
        if (err) {
            return res.status(400).json({ msg: 'ID no válido.' });
        }

        if (!user) {
            return res.status(400).json({ msg: 'Perfil no encontrada.' });
        }

        const profile = {
            _id: user._id,
            names: user.names,
            surnames: user.surnames,
            birthdate: user.birthdate,
            email: user.email,
            avatar: user.avatar,
            banner: user.banner,
            biography: user.biography,
            location: user.location,
            website: user.website
        }

        res.status(200).json(profile);
    });
}

exports.updateUser = (req, res) => {
    if (!Object.keys(req.body).length) {
        return res.status(400).json({ msg: 'Información inválida.' });
    }

    Users.findOneAndUpdate({ _id: req.user._id }, { $set: req.body }, { new: true }, (err) => {
        if (err) {
            return res.status(500).json({ msg: 'Se ha producido un error. Por favor, inténtelo más tarde.' });
        }

        res.sendStatus(200);
    });
}