const express = require('express');
const router = express.Router();
const controllers = require('../controllers/controllers');

router.get('/', controllers.getHome); // Testing

router.get('/packets', controllers.getPackets);

router.get('/counts', controllers.getCounts)

router.get('/clear', controllers.getClear);

module.exports = router; 