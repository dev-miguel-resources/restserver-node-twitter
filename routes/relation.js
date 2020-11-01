const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { userById } = require('../middlewares/user');
const relationController = require('../controllers/relationController');

router.get('/relation',
    auth,
    relationController.readRelation
);

router.post('/relation/create/:userRelationId',
    auth,
    relationController.createRelation
);

router.delete('/relation/:userRelationId',
    auth,
    relationController.deleteRelation
);

router.param('userRelationId', userById);

module.exports = router;