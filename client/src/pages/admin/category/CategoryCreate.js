import React, { useState, useEffect } from 'react'
import AdminNav from '../../../components/nav/AdminNav'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import { getCategories, removeCategory, createCategory } from '../../../functions/category'

import { Link } from 'react-router-dom'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

import CategoryForm from '../../../components/forms/CategoryForm'
import LocalSearch from '../../../components/forms/LocalSearch'

const CategoryCreate = () => {

    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)
    const { user } = useSelector((state) => ({ ...state }));
    const [categories, setCategories] = useState([])
    //searching/filtering
    const [keyword, setKeyword] = useState("")

    useEffect(() => {
        loadCategories()
    }, [])

    const loadCategories = () => {
        getCategories().then((c) => setCategories(c.data))
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        //console.log(name)
        setLoading(true)
        createCategory({ name }, user.token)
            .then(res => {
                console.log(res)
                setLoading(false)
                setName('')
                toast.success(`"${res.data.name}" is created`)
                loadCategories()
            })
            .catch((err) => {
                console.log(err)
                setLoading(false)
                if (err.response.status === 400) toast.error(err.response.data)
            })
    }

    const handleRemove = async (slug) => {
        if (window.confirm("Delete")) {
            setLoading(true)
            removeCategory(slug, user.token)
                .then(
                    res => {
                        console.log(res)
                        setLoading(false)
                        toast.success(`"${res.data.name}" is deleted`)
                        loadCategories()
                    }
                )
                .catch(
                    (err) => {
                        console.log(err)
                        setLoading(false)
                        if (err.response.status === 400) toast.error(err.response.data)
                    }
                )
        }

    }

    const searched = (keyword) => (c) => c.name.toLowerCase().includes(keyword)

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2"><AdminNav /></div>
                <div className="col">
                    {loading ? <h4 className="text-danger">Loading...</h4> : <h4>category create</h4>}
                    <CategoryForm handleSubmit={handleSubmit} name={name} setName={setName} />

                    <LocalSearch
                        keyword={keyword}
                        setKeyword={setKeyword}
                    />
                    <br />
                    {categories.filter(searched(keyword)).map((c) => (
                        <div key={c._id} className="alert alert-secondary">
                            {c.name}{" "}
                            <span className="btn btn-sm float-right"
                                // make a note of how this function is called and how handleSubmit was called.
                                onClick={() => handleRemove(c.slug)}>
                                <DeleteOutlined className="text-danger" />
                            </span>
                            <Link to={`/admin/category/${c.slug}`}>
                                <span className="btn btn-sm float-right">
                                    <EditOutlined className="text-warning" />
                                </span>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CategoryCreate;