const express = require('express');
const router = express.Router();
const { listSaved, addSaved, removeSaved } = require('../controller/saved.controller');

router.get('/', listSaved);
router.post('/', addSaved);
router.delete('/:jobId', removeSaved);

module.exports = router;
