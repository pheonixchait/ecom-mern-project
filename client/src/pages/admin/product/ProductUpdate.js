import React, { useState, useEffect } from 'react'
import AdminNav from '../../../components/nav/AdminNav'

import { getProduct, updateProduct } from '../../../functions/product'
import { getCategories, getCategorySubs } from '../../../functions/category'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import ProductUpdateForm from '../../../components/forms/ProductUpdateForm'
import FileUpload from '../../../components/forms/FileUpload'
import { LoadingOutlined } from '@ant-design/icons'

const initialState = {
    title: "",
    description: "",
    price: "",
    //categories: [], because it is not allowing to set value of this, we create another state
    category: "",
    subs: [],
    shipping: "",
    quantity: "",
    images: [],
    colors: ["Black", "Brown", "Silver", "White", "Blue"],
    brands: ["Apple", "Samsung", "Microsoft", "Lenovo", "ASUS"],
    color: "",
    brand: "",
}

const ProductUpdate = ({ match, history }) => { //use of props here

    const [values, setValues] = useState(initialState)
    const { user } = useSelector((state) => ({ ...state }));
    const [loading, setLoading] = useState(false)
    const { slug } = match.params // you can also use useParams() of react router dom
    const [subOptions, setSubOptions] = useState([])
    const [categories, setCategories] = useState([])
    const [arrayOfSubIds, setArrayOfSubIds] = useState([])
    const [selectedCategory, setSelectedCategory] = useState("")

    useEffect(() => {
        loadProduct()
        loadCategories()
    }, [])

    const loadProduct = () => {
        getProduct(slug)
            .then((p) => {
                //load product data
                setValues({ ...values, ...p.data })
                //load sub categories for a category, extra step here because now we get array of objects instead of array of ids which is required by select of antd, early we could directly use subs state from values
                getCategorySubs(p.data.category._id)
                    .then((res) => {
                        setSubOptions(res.data)
                    })
                //prepare array of subs id to show as default subs in select antd
                let arr = []
                p.data.subs.map((s) => {
                    arr.push(s._id)
                })
                setArrayOfSubIds((prev) => arr) //note why prev is used
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const loadCategories = () => {
        getCategories().then((c) => {
            setCategories(c.data)
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        values.subs = setArrayOfSubIds
        values.category = selectedCategory ? setArrayOfSubIds : values.category

        updateProduct(slug, values, user.token)
            .then((res) => {
                setLoading(false)
                toast.success(`${res.data.title} is updated`)
                history.push('/admin/products')
            })
            .catch((err) => {
                setLoading(false)
                toast(err.response.data.err)
                console.log(err)
            })
    }

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value }) //spread values, look how one function can change each value
    }

    const handleCategoryChange = (e) => {
        e.preventDefault()
        setValues({ ...values, subs: [] })
        setSelectedCategory(e.target.value) //created selectedCategory because category couldn't used in if else
        getCategorySubs(e.target.value)
            .then(res => {
                console.log(res.data)
                setSubOptions(res.data)
            })
        // to retain defaults of sub even after category switch
        if (values.category._id === e.target.value)
            loadProduct()
        else
            setArrayOfSubIds([])
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2"><AdminNav /></div>
                <div className="col-md-10">
                    {loading ? <LoadingOutlined className="text-danger h1" /> : <h4>Product update</h4>}
                    <div className="p-3">
                        <FileUpload values={values} setValues={setValues} setLoading={setLoading} />
                    </div>

                    <ProductUpdateForm
                        handleSubmit={handleSubmit}
                        handleChange={handleChange}
                        values={values}
                        setValues={setValues}
                        handleCategoryChange={handleCategoryChange}
                        categories={categories}
                        subOptions={subOptions}
                        arrayOfSubIds={arrayOfSubIds}
                        setArrayOfSubIds={setArrayOfSubIds}
                        selectedCategory={selectedCategory}
                    />
                </div>
            </div>
        </div>
    )
}

export default ProductUpdate