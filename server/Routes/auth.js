const express = require('express')

const router = express.Router()

const { createOrUpdateUser, currentUser } = require('../controllers/auth')

const { authCheck, adminCheck } = require('../middleware/auth')

router.post("/create-or-update-user", authCheck, createOrUpdateUser);
router.post("/current-user", authCheck, currentUser);
router.post("/current-admin", authCheck, adminCheck, currentUser);

//here we are exporting whole module
module.exports = router;