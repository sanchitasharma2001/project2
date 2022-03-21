const express = require('express');
const router = express.Router();
const allController = require('../controller/allController')


router.post('/colleges',allController.createCollege)
router.post('/interns',allController.createIntern)


module.exports =router