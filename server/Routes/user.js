const express = require('express');
const { userCart, getUserCart, emptyCart, saveAddress, applyCouponToUserCart, createOrder, orders,
    wishList,
    addToWishList,
    removeFromWishList,
    createCashOrder } = require('../controllers/user');
const { authCheck } = require('../middleware/auth')

const router = express.Router()

router.post("/user/cart", authCheck, userCart);
router.get("/user/cart", authCheck, getUserCart);
router.delete("/user/cart", authCheck, emptyCart);
router.post("/user/address", authCheck, saveAddress);

router.post("/user/cart/coupon", authCheck, applyCouponToUserCart);

router.post("/user/order", authCheck, createOrder);

router.get("/user/orders", authCheck, orders);

//wishlist
router.post("/user/wishlist", authCheck, addToWishList);
router.get("/user/wishlist", authCheck, wishList);
router.put("/user/wishlist/:productId", authCheck, removeFromWishList);

router.post("/user/cash-order", authCheck, createCashOrder);

/* router.get("/user", (req, res) => {
    res.json({
        data: "you hit the user api"
    });
}); */

module.exports = router;