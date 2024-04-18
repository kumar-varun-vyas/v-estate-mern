const express = require('express');
const { test } = require('../controllers/user.cont');

const router = express.Router()


router.get('/', test)


module.exports = router