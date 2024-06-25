const express = require('express');
const { updateUser, deleteUser, signOut, getListing } = require('../controllers/user.cont');
const { verifyToken } = require('../utils/verifyToken')

const router = express.Router()

router.post('/updateUser/:id', verifyToken, updateUser)
router.delete('/delete/:id', verifyToken, deleteUser)
router.get('/signout', signOut)
router.get('/listing/:id', verifyToken, getListing)



module.exports = router