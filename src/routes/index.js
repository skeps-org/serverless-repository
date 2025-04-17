const express = require('express');

const serverlessController = require('../controllers/serverlessFunctions');

const router = express();

router.post('/lender-webhook', serverlessController.lenderWebhook);

module.exports = router;
