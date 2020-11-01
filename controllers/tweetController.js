const Tweets = require('../models/Tweets');
const Relations = require('../models/Relations');
const { validationResult } = require('express-validator');
const { findById } = require('../models/Tweets');

exports.readTweets = (req, res) => {
    if (!req.query.id) {
        return res.status(400).json({ msg: 'Parámetro ID no válido.' });
    }

    if (!req.query.page) {
        return res.status(400).json({ msg: 'Parámetro página no válido.' });
    }

    if (!Number.isInteger(parseInt(req.query.page))) {
        return res.status(400).json({ msg: 'Parámetro página debe ser un valor númerico.' });
    }

    if (parseInt(req.query.page) <= 0) {
        return res.status(400).json({ msg: 'Parámetro página debe ser mayor a 0.' });
    }

    const page = parseInt(req.query.page);

    Tweets.find({ userId: req.query.id })
        .select('_id userId message createdAt')
        .populate('userId', 'names surnames avatar')
        .sort('-createdAt')
        .skip((page - 1) * 10)
        .limit(10)
        .exec((err, tweets) => {
            if (err) {
                return res.status(400).json({ msg: 'ID no válido.' });
            }

            if (!tweets.length > 0) {
                return res.status(200).json([]);
            }
            
            res.status(200).json(tweets);
        });
}

exports.readTweetsFollowers = (req, res) => {
    if (!req.query.page) {
        return res.status(400).json({ msg: 'Parámetro página no válido.' });
    }

    if (!Number.isInteger(parseInt(req.query.page))) {
        return res.status(400).json({ msg: 'Parámetro página debe ser un valor númerico.' });
    }

    if (parseInt(req.query.page) <= 0) {
        return res.status(400).json({ msg: 'Parámetro página debe ser mayor a 0.' });
    }

    const page = parseInt(req.query.page);
    const skip = (page - 1) * 10;

    Relations.aggregate([
        {
            $match: {
                userId: req.user._id
            }
        },
        {
            $lookup: {
                from: 'tweets',
                localField: 'userRelationId',
                foreignField: 'userId',
                as: 'tweets'
            }
        },
        {
            $unwind: "$tweets"
        },
        {
            $lookup: {
                from: 'users',
                localField: 'userRelationId',
                foreignField: '_id',
                as: 'users'
            }
        },
        {
            $unwind: "$users"
        },
        {
            $project: {
                createdAt: 0,
                updatedAt: 0,
                __v: 0,
                tweets: {
                    userId: 0,
                    updatedAt: 0,
                    __v: 0
                },
                users: {
                    _id: false,
                    birthdate: false,
                    banner: false,
                    biography: false,
                    location: false,
                    website: false,
                    email: false,
                    password: false,
                    createdAt: false,
                    updatedAt: false,
                    __v: false
                }
            }
        },
        {
            $sort: {
                'tweets.createdAt': - 1
            }
        },
        {
            $skip: skip
        },
        {
            $limit: 10
        }
    ], (err, tweets) => {
        if (err) {
            return res.status(500).json({ msg: 'Se ha producido un error. Por favor, inténtelo más tarde.' });
        }

        res.status(200).json(tweets);
    });
}

exports.createTweet = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json(errors);
    }

    try {
        const data = { userId: req.user._id, message: req.body.message };
        const tweet = new Tweets(data);
        await tweet.save();

        res.sendStatus(201);
    } catch (error) {
        res.status(500).json({ msg: 'Se ha producido un error. Por favor, inténtelo más tarde.' });
    }
}

exports.deleteTweet = (req, res) => {
    Tweets.findById(req.params.tweetId).exec((err, tweet) => {
        if (err) {
            return res.status(400).json({ msg: 'ID no válido.' });
        }

        if (!tweet) {
            return res.status(400).json({ msg: 'Tweet no encontrado.' });
        }

        if (String(req.user._id) !== String(tweet.userId)) {
            return res.status(401).json({ msg: 'Acción no permitida.' });
        }

        Tweets.findByIdAndRemove(tweet._id, err => {
            if (err) {
                return res.status(500).json({ msg: 'Se ha producido un error. Por favor, inténtelo más tarde.' });
            }

            res.sendStatus(200);
        });
    });
}