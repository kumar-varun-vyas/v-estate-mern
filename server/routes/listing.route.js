const express = require('express')
const { verifyToken } = require('../utils/verifyToken')
const router = express.Router()
const { createListing, deleteListing } = require('../controllers/listing.controller')

router.post('/create', verifyToken, createListing)
router.delete('/delete/:id', verifyToken, deleteListing)


module.exports = router