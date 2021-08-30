import axios from 'axios'

export const createProduct = async (product, authToken) => await axios.post(
    `${process.env.REACT_APP_API}/product`, product, {
    headers: {
        authToken,
    },
})

export const getProductByCounts = async (count) => await axios.get(
    `${process.env.REACT_APP_API}/products/${count}`
)

export const removeProduct = async (slug, authToken) => await axios.delete(
    `${process.env.REACT_APP_API}/product/${slug}`, {
    headers: {
        authToken,
    },
})

export const getProduct = async (slug) => await axios.get(
    `${process.env.REACT_APP_API}/product/${slug}`
)

export const updateProduct = async (slug, product, authToken) => await axios.put(
    `${process.env.REACT_APP_API}/product/${slug}`, product, {
    headers: {
        authToken,
    },
})

export const getProducts = async (sort, order, page) => await axios.post(
    `${process.env.REACT_APP_API}/products`, {
    sort,
    order,
    page
})

export const getProductsCount = async () => await axios.get(
    `${process.env.REACT_APP_API}/products/total`
)

export const productStar = async (productId, star, authToken) => await axios.put(
    `${process.env.REACT_APP_API}/product/star/${productId}`, { star }, {
    headers: {
        authToken,
    },
})

export const getRelated = async (productId) => await axios.get(
    `${process.env.REACT_APP_API}/product/related/${productId}`
)

export const fetchProductsByFilter = async (arg) => await axios.post(
    `${process.env.REACT_APP_API}/search/filters`, arg
)