import React, { useState, useEffect } from 'react'
import AdminNav from '../../../components/nav/AdminNav'

import { createProduct } from '../../../functions/product'
import { getCategories, getCategorySubs } from '../../../functions/category'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import ProductCreateForm from '../../../components/forms/ProductCreateForm'
import FileUpload from '../../../components/forms/FileUpload'
import { LoadingOutlined } from '@ant-design/icons'

const initialState = {
    title: "Macbook Pro",
    description: "Apple's macbook pro",
    price: "4000",
    categories: [],
    category: "",
    subs: [],
    shipping: "Yes",
    quantity: "100",
    images: [],
    colors: ["Black", "Brown", "Silver", "White", "Blue"], //my question is why you need to initialise it, maybe we want to make frontend code less
    brands: ["Apple", "Samsung", "Microsoft", "Lenovo", "ASUS"],
    color: "Silver",
    brand: "Apple",
}

const ProductCreate = () => {

    const [values, setValues] = useState(initialState)
    const [subOptions, setSubOptions] = useState([]) //sub categories to show as options in select
    const [showSubs, setShowSubs] = useState(false) //to show sub category field only when category is changed
    const [loading, setLoading] = useState(false)
    const { user } = useSelector((state) => ({ ...state }));

    useEffect(() => {
        loadCategories()
    }, [])

    const loadCategories = () => {
        getCategories().then((c) => setValues({ ...values, categories: c.data }))
    }

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value }) //spread values, look how one function can change each value
    }

    const handleCategoryChange = (e) => {
        e.preventDefault()
        setValues({ ...values, subs: [], category: e.target.value })
        getCategorySubs(e.target.value)
            .then(res => {
                console.log(res.data)
                setSubOptions(res.data)
            })
        setShowSubs(true)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        createProduct(values, user.token)
            .then(res => {
                console.log(res)
                window.alert(`"${res.data.title}" is created`) //we are using here alert instead of toast like usual because we want to reload the inputs as blank, normal setValues won't work here as it blanks out colors and brands
                window.location.reload()
            })
            .catch(err => {
                console.log(err)
                //if (err.response.status === 400) toast.error(err.response.data)
                toast.error(err.response.data.err)
            })
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2"><AdminNav /></div>
                <div className="col-md-10">
                    {loading ? <LoadingOutlined className="text-danger h1" /> : <h4>Product create</h4>}

                    <div className="p-3">
                        <FileUpload values={values} setValues={setValues} setLoading={setLoading} />
                    </div>

                    <ProductCreateForm
                        handleSubmit={handleSubmit}
                        handleChange={handleChange}
                        values={values}
                        setValues={setValues}
                        handleCategoryChange={handleCategoryChange}
                        subOptions={subOptions}
                        showSubs={showSubs}
                    />
                </div>
            </div>
        </div>
    )
}

export default ProductCreate