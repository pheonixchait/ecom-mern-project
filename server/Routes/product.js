const express = require('express')

const router = express.Router()

const { create, listAll, remove, read, update, list, productsCount, productStar, listRelated, searchFilters } = require('../controllers/product')

const { authCheck, adminCheck } = require('../middleware/auth')

router.post("/product", authCheck, adminCheck, create);
router.get("/products/total", productsCount) //placement of these are important
router.get("/products/:count", listAll);
router.get("/product/:slug", read);
router.put("/product/:slug", authCheck, adminCheck, update);
router.delete("/product/:slug", authCheck, adminCheck, remove);

router.post("/products", list)

router.put("/product/star/:productId", authCheck, productStar)

router.get("/product/related/:productId", listRelated)
//
router.post("/search/filters", searchFilters)

//here we are exporting whole module
module.exports = router;