const express = require('express');
const router = express.Router();
const internsController = require('../controller/internsController')
const collegeController= require('../controller/collegeController')

router.post('/functionup/colleges',collegeController.createCollege)
router.post('/functionup/interns',internsController.createInterns)
router.get('/functionup/collegeDetails',internsController.getAllInterns)

module.exports =router