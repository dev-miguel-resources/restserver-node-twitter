const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const tweetController = require('../controllers/tweetController');
const { check } = require('express-validator');

router.get('/tweets',
    auth,
    tweetController.readTweets
);

router.get('/tweets/followers',
    auth,
    tweetController.readTweetsFollowers
);

router.post('/tweet/create',
    auth,
    [
        check('message', 'El mensaje es obligatorio.').not().isEmpty()
    ],
    tweetController.createTweet
);

router.delete('/tweet/:tweetId',
    auth,
    tweetController.deleteTweet
);

module.exports = router;