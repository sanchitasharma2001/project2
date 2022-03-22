const express = require('express');
const router = express.Router();
const allController = require('../controller/allController')


router.post('/functionup/colleges',allController.createCollege)
router.post('/functionup/interns',allController.createInterns)
router.get('/functionup/collegeDetails',allController.getAllInterns)

module.exports =router