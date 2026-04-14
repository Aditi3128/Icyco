const express = require('express');
const { chat } = require('../controllers/aiController');

const router = express.Router();

router.post('/', chat);

module.exports = router;
