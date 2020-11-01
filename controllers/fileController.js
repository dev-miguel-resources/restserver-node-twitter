const Users = require('../models/Users');
const multer = require('multer');
const fs = require('fs');

exports.uploadAvatar = (req, res) => {
    const storageConfig = multer.diskStorage({
        destination: (req, filename, cb) => {
            cb(null, __dirname + '/../uploads/avatars');
        },
        filename: (req, file, cb) => {
            const fileExtension = file.originalname.substring(file.originalname.lastIndexOf('.'));

            cb(null, `${req.user._id}${fileExtension}`);
        }
    });

    const filterConfig = (req, file, cb) => {
        const { mimetype } = file;
        const typeArray = mimetype.split('/');

        if (typeArray[0] != 'image') {
            return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file), false);
        }

        cb(null, true);
    }

    const upload = multer({
        storage: storageConfig,
        fileFilter: filterConfig,
        limits: { fileSize: 1024 * 1024 * 5 }
    }).single('avatar');

    upload(req, res, async error => {
        if (error) {
            return res.status(400).json({ error });
        }

        const user = await Users.findOne({ email: req.user.email });
        user.avatar = req.file.filename
        await user.save();

        res.sendStatus(201);
    });
}

exports.uploadBanner = (req, res) => {
    const storageConfig = multer.diskStorage({
        destination: (req, filename, cb) => {
            cb(null, __dirname + '/../uploads/banners');
        },
        filename: (req, file, cb) => {
            const fileExtension = file.originalname.substring(file.originalname.lastIndexOf('.'));

            cb(null, `${req.user._id}${fileExtension}`);
        }
    });

    const filterConfig = (req, file, cb) => {
        const { mimetype } = file;
        const typeArray = mimetype.split('/');

        if (typeArray[0] != 'image') {
            return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file), false);
        }

        cb(null, true);
    }

    const upload = multer({
        storage: storageConfig,
        fileFilter: filterConfig,
        limits: { fileSize: 1024 * 1024 * 5 }
    }).single('banner');

    upload(req, res, async error => {
        if (error) {
            return res.status(400).json({ error });
        }

        const user = await Users.findOne({ email: req.user.email });
        user.banner = req.file.filename
        await user.save();

        res.sendStatus(201);
    });
}

exports.getAvatar = (req, res) => {
    if (!req.query.id) {
        return res.status(400).json({ msg: 'Parámetro ID no válido' });
    }

    Users.findById(req.query.id, (err, user) => {
        if (err) {
            return res.status(400).json({ msg: 'ID no válido.' });
        }

        if (!user) {
            return res.status(400).json({ msg: 'Usuario no encontrado.' });
        }

        if (!user.avatar) {
            return res.status(400).json({ msg: 'Avatar no asignado.' });
        }

        const avatarPath = `${__dirname}/../uploads/avatars/${user.avatar}`;

        fs.stat(avatarPath, (err, stat) => {
            if (err) {
                return res.status(400).json({ msg: 'Avatar no encontrado.' });
            }

            const avatar = fs.readFileSync(avatarPath);
            res.contentLength = stat.size;
            res.end(avatar, 'binary');
        });
    });
}

exports.getBanner = (req, res) => {
    if (!req.query.id) {
        return res.status(400).json({ msg: 'Parámetro ID no válido' });
    }

    Users.findById(req.query.id, (err, user) => {
        if (err) {
            return res.status(400).json({ msg: 'ID no válido.' });
        }

        if (!user) {
            return res.status(400).json({ msg: 'Usuario no encontrado.' });
        }

        if (!user.banner) {
            return res.status(400).json({ msg: 'Banner no asignado.' });
        }

        const bannerPath = `${__dirname}/../uploads/banners/${user.banner}`;

        fs.stat(bannerPath, (err, stat) => {
            if (err) {
                return res.status(400).json({ msg: 'Banner no encontrado.' });
            }

            const banner = fs.readFileSync(bannerPath);
            res.contentLength = stat.size;
            res.end(banner, 'binary');
        });
    });
}