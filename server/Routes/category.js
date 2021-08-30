const express = require('express')

const router = express.Router()

const { create, read, update, remove, list, getSubs } = require('../controllers/category')

const { authCheck, adminCheck } = require('../middleware/auth')

router.post("/category", authCheck, adminCheck, create);
router.get("/categories", list);
router.get("/category/:slug", read);
router.put("/category/:slug", authCheck, adminCheck, update);
router.delete("/category/:slug", authCheck, adminCheck, remove);
router.get("/category/subs/:_id", getSubs) // for getting subs based on caregory id

//here we are exporting whole module
module.exports = router;