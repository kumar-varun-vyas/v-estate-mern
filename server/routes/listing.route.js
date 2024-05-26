const express = require('express')
const { verifyToken } = require('../utils/verifyToken')
const router = express.Router()
const { createListing } = require('../controllers/listing.controller')

router.post('/create', createListing)

module.exports = router