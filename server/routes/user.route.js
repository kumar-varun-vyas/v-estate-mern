const express = require('express');
const { updateUser } = require('../controllers/user.cont');
const { verifyToken } = require('../utils/verifyToken')

const router = express.Router()

router.post('/updateUser/:id', verifyToken, updateUser)



module.exports = router