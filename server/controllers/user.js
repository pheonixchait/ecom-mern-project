const User = require("../models/user");
const Cart = require("../models/cart");
const Product = require("../models/product");
const Coupon = require("../models/coupon");
const Order = require("../models/order");
const uniqueid = require("uniqueid");

exports.userCart = async (req, res) => {
    const { cart } = req.body;
    console.log("inside controller")

    let products = []

    const user = await User.findOne({ email: req.user.email }).exec();

    let cartExistByThisUser = await Cart.findOne({ orderedBy: user._id }).exec();

    if (cartExistByThisUser) {
        cartExistByThisUser.remove();
        console.log("removed old cart");
    }

    for (let i = 0; i < cart.length; i++) {
        let object = {};

        object.product = cart[i]._id;
        object.count = cart[i].count;
        object.color = cart[i].color;

        let { price } = await Product.findById(cart[i]._id).select("price").exec();
        object.price = price;

        products.push(object);
    }

    //this can be done in above for loop also but for sense of clarity we write in seperate for loop
    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
        cartTotal = cartTotal + products[i].price * products[i].count;
    }

    let newCart = await new Cart({
        products,
        cartTotal,
        orderedBy: user._id,
    }).save();

    console.log('new cart', newCart);
    res.json({ ok: true });
}
//awaits are written whereever we have db related operations.

exports.getUserCart = async (req, res) => {
    const user = await User.findOne({ email: req.user.email }).exec();

    let cart = await Cart.findOne({ orderedBy: user._id })
        .populate("products.product", "_id title price totalAfterDiscount")
        .exec();

    const { products, cartTotal, totalAfterDiscount } = cart;
    res.json({ products, cartTotal, totalAfterDiscount });
}

exports.emptyCart = async (req, res) => {
    const user = await User.findOne({ email: req.user.email }).exec();

    const cart = await Cart.findOneAndRemove({ orderedBy: user._id }).exec();
    res.json(cart)
}

exports.saveAddress = async (req, res) => {
    const userAddress = await User.findOneAndUpdate(
        { email: req.user.email },
        { address: req.body.address }
    ).exec()

    res.json({ ok: true });
}

exports.applyCouponToUserCart = async (req, res) => {
    const { coupon } = req.body;

    const validCoupon = await Coupon.findOne({ name: coupon }).exec();

    if (validCoupon === null) {
        return res.json({
            err: "invalid coupon"
        })
    }

    const user = await User.findOne({ email: req.user.email }).exec();
    let { cartTotal } = await Cart.findOne({ orderedBy: user._id })
        .populate("products.product", "_id title price")
        .exec();

    let totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount) / 100).toFixed(2);

    Cart.findOneAndUpdate(
        { orderedBy: user._id },
        { totalAfterDiscount },
        { new: true } //not needed if you are sending just totalAfterDiscount
    ).exec();

    res.json(totalAfterDiscount);
}

exports.createOrder = async (req, res) => {
    const paymentIntent = req.body.stripeResponse;
    const user = await User.findOne({ email: req.user.email }).exec();

    let { products } = await Cart.findOne({ orderedBy: user._id }).exec();

    let newOrder = await new Order({
        products,
        paymentIntent,
        orderedBy: user._id,
    }).save();

    //decrement quantity, increment sold
    let bulkOption = products.map((item) => {
        return {
            updateOne: {
                filter: { _id: item.product._id },
                update: { $inc: { quantity: -item.count, sold: +item.count } },
            },
        };
    });

    let updated = await Product.bulkWrite(bulkOption, {});

    console.log("decrement quantity, increment sold", updated)

    console.log("New order saved", newOrder)
    res.json({ ok: true })
}

exports.orders = async (req, res) => {
    const user = await User.findOne({ email: req.user.email }).exec();

    let userOrders = await Order.find({ orderedBy: user._id })
        .populate('products.product')
        .exec();

    res.json(userOrders);
}

//wishlist
exports.wishList = async (req, res) => {
    const list = await User.findOne({ email: req.user.email })
        .select('wishList')
        .populate('wishList')
        .exec();

    res.json(list)
}

exports.addToWishList = async (req, res) => {
    const { productId } = req.body;
    const user = await User.findOneAndUpdate({ email: req.user.email },
        { $addToSet: { wishList: productId } }
    ).exec();

    res.json({ ok: true })
}

exports.removeFromWishList = async (req, res) => {
    const { productId } = req.params;
    const user = await User.findOneAndUpdate({ email: req.user.email },
        { $pull: { wishList: productId } }
    ).exec();

    res.json({ ok: true })
}

exports.createCashOrder = async (req, res) => {
    console.log("body", req.body);
    const { COD, couponApplied } = req.body;
    if (!COD) return res.status(400).send("Create cash order failed");
    const user = await User.findOne({ email: req.user.email }).exec();

    let userCart = await Cart.findOne({ orderedBy: user._id }).exec();
    //if COD is true, create order with status as "Cash on delivery"
    let finalAmount = 0;
    console.log("DISCOUNT AMT", userCart.totalAfterDiscount, couponApplied);
    if (couponApplied && userCart.totalAfterDiscount) {
        finalAmount = userCart.totalAfterDiscount * 100;
    } else {
        finalAmount = userCart.cartTotal * 100;
    }

    let paymentIntent = {
        paymentIntent: {
            id: uniqueid(),
            amount: finalAmount,
            currency: "usd",
            status: "Cash On Delivery",
            created: Date.now(),
            payment_method_types: ['cash']
        }
    }

    let newOrder = await new Order({
        orderStatus: "Cash On Delivery",
        products: userCart.products,
        paymentIntent: paymentIntent,
        orderedBy: user._id,
    }).save();

    //decrement quantity, increment sold
    let bulkOption = userCart.products.map((item) => {
        return {
            updateOne: {
                filter: { _id: item.product._id },
                update: { $inc: { quantity: -item.count, sold: +item.count } },
            },
        };
    });

    let updated = await Product.bulkWrite(bulkOption, {});

    console.log("decrement quantity, increment sold", updated)

    console.log("New order saved", newOrder)
    res.json({ ok: true });
}