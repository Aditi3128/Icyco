const express = require('express');
const { submitCatering } = require('../controllers/cateringController');

const router = express.Router();

router.post('/', submitCatering);

module.exports = router;
