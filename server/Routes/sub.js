const express = require('express')

const router = express.Router()

const { create, read, update, remove, list } = require('../controllers/sub')

const { authCheck, adminCheck } = require('../middleware/auth')

router.post("/sub", authCheck, adminCheck, create);
router.get("/subs", list);
router.get("/sub/:slug", read);
router.put("/sub/:slug", authCheck, adminCheck, update);
router.delete("/sub/:slug", authCheck, adminCheck, remove);

//here we are exporting whole module
module.exports = router;