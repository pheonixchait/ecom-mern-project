const express = require('express')

const router = express.Router()

const { create, remove, list } = require('../controllers/coupon')

const { authCheck, adminCheck } = require('../middleware/auth')

router.post("/coupon", authCheck, adminCheck, create);
router.get("/coupons", list);
router.delete("/coupon/:couponId", authCheck, adminCheck, remove);
//here we are exporting whole module
module.exports = router;