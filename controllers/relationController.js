const Relations = require('../models/Relations');

exports.readRelation = (req, res) => {
    if (!req.query.id) {
        return res.status(400).json({ msg: 'Parámetro ID no válido' });
    }

    Relations.findOne({ userId: req.user._id, userRelationId: req.query.id }, (err, relation) => {
        if (err) {
            return res.status(400).json({ msg: 'ID no válido.' });
        }

        const status = !relation ? false : true;

        res.status(200).json({ status });
    });
}

exports.createRelation = async (req, res) => {
    try {
        const { userRelationId } = req.params;
        const data = { userId: req.user._id, userRelationId };
        const relation = new Relations(data);
        await relation.save();

        res.sendStatus(201);
    } catch (error) {
        res.status(500).json({ msg: 'Se ha producido un error. Por favor, inténtelo más tarde.' });
    }
}

exports.deleteRelation = (req, res) => {
    const { userRelationId } = req.params;

    Relations.findOne({ userId: req.user._id, userRelationId }, (err, relation) => {
        if (err) {
            return res.status(400).json({ msg: 'ID no válido.' });
        }

        if (!relation) {
            return res.status(400).json({ msg: 'Relación no encontrada.' });
        }

        Relations.findByIdAndRemove(relation._id, err => {
            if (err) {
                return res.status(500).json({ msg: 'Se ha producido un error. Por favor, inténtelo más tarde.' });
            }

            res.sendStatus(200);
        });
    });
}