import axios from 'axios'

export const userCart = async (cart, authToken) =>
    await axios.post(`${process.env.REACT_APP_API}/user/cart`,
        { cart },
        {
            headers: {
                authToken,
            }
        },
    ) //because of parenthesis around cart it can be accessed as req.body.cart else it will be accessed as req.body

export const getUserCart = async (authToken) =>
    await axios.get(`${process.env.REACT_APP_API}/user/cart`,
        {
            headers: {
                authToken,
            },
        },
    )

export const emptyCart = async (authToken) =>
    await axios.delete(`${process.env.REACT_APP_API}/user/cart`,
        {
            headers: {
                authToken,
            },
        },
    )

export const saveUserAddress = async (address, authToken) =>
    await axios.post(`${process.env.REACT_APP_API}/user/address`,
        { address },
        {
            headers: {
                authToken,
            }
        },
    )

export const applyCoupon = async (coupon, authToken) =>
    await axios.post(`${process.env.REACT_APP_API}/user/cart/coupon`,
        { coupon },
        {
            headers: {
                authToken,
            }
        },
    )

export const createOrder = async (stripeResponse, authToken) =>
    await axios.post(`${process.env.REACT_APP_API}/user/order`,
        { stripeResponse },
        {
            headers: {
                authToken,
            }
        },
    )

export const getUserOrders = async (authToken) =>
    await axios.get(`${process.env.REACT_APP_API}/user/orders`,
        {
            headers: {
                authToken,
            },
        },
    )

export const getWishlist = async (authToken) =>
    await axios.get(`${process.env.REACT_APP_API}/user/wishlist`,
        {
            headers: {
                authToken,
            },
        },
    )

export const removeWishlist = async (productId, authToken) =>
    await axios.put(`${process.env.REACT_APP_API}/user/wishlist/${productId}`,
        {},
        {
            headers: {
                authToken,
            },
        },
    )

export const addToWishlist = async (productId, authToken) =>
    await axios.post(`${process.env.REACT_APP_API}/user/wishlist`,
        { productId },
        {
            headers: {
                authToken,
            },
        },
    )

export const createCashOrderForUser = async (authToken, COD, coupon) =>
    await axios.post(`${process.env.REACT_APP_API}/user/cash-order`,
        { couponApplied: coupon, COD },
        {
            headers: {
                authToken,
            }
        },
    )

