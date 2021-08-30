import axios from 'axios'

export const getCategories = async () => await axios.get(
    `${process.env.REACT_APP_API}/categories`)

export const getCategory = async (slug) => await axios.get(
    `${process.env.REACT_APP_API}/category/${slug}`)

export const removeCategory = async (slug, authToken) => await axios.delete(
    `${process.env.REACT_APP_API}/category/${slug}`, {
    headers: {
        authToken,
    },
})

export const updateCategory = async (slug, category, authToken) => await axios.put(
    `${process.env.REACT_APP_API}/category/${slug}`, category, {
    headers: {
        authToken,
    },
})

export const createCategory = async (category, authToken) => await axios.post(
    `${process.env.REACT_APP_API}/category`, category, {
    headers: {
        authToken,
    },
})

export const getCategorySubs = async (_id) => await axios.get(
    `${process.env.REACT_APP_API}/category/subs/${_id}`)