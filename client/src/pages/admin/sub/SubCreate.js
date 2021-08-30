import React, { useState, useEffect } from 'react'
import AdminNav from '../../../components/nav/AdminNav'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import { getSubs, removeSub, createSub } from '../../../functions/sub'
import { getCategories } from '../../../functions/category'

import { Link } from 'react-router-dom'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

import CategoryForm from '../../../components/forms/CategoryForm'
import LocalSearch from '../../../components/forms/LocalSearch'

const SubCreate = () => {

    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)
    const { user } = useSelector((state) => ({ ...state }));
    const [categories, setCategories] = useState([])
    const [subs, setSubs] = useState([])
    const [category, setCategory] = useState("") //to hold parent
    //searching/filtering
    const [keyword, setKeyword] = useState("")

    useEffect(() => {
        loadCategories()
        loadSubs()
    }, [])

    const loadCategories = () => {
        getCategories().then((c) => setCategories(c.data))
    }

    const loadSubs = () => getSubs().then((c) => setSubs(c.data))

    const handleSubmit = (e) => {
        e.preventDefault()
        //console.log(name)
        setLoading(true)
        createSub({ name, parent: category }, user.token)
            .then(res => {
                console.log(res)
                setLoading(false)
                setName('')
                toast.success(`"${res.data.name}" is created`)
                loadSubs()
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
            removeSub(slug, user.token)
                .then(
                    res => {
                        console.log(res)
                        setLoading(false)
                        toast.success(`"${res.data.name}" is deleted`)
                        loadSubs()
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
                    {loading ? <h4 className="text-danger">Loading...</h4> : <h4>Sub category create</h4>}
                    <div className="form-group">
                        <label>Parent Category</label>
                        <select name="category" className="form-control" onChange={(e) => setCategory(e.target.value)}>
                            <option>Please Select</option>
                            {categories.length > 0 && categories.map((c) => (<option key={c._id} value={c._id}>{c.name}</option>))}
                        </select>
                    </div>
                    <CategoryForm handleSubmit={handleSubmit} name={name} setName={setName} />

                    <LocalSearch
                        keyword={keyword}
                        setKeyword={setKeyword}
                    />
                    <br />
                    {subs.filter(searched(keyword)).map((c) => (
                        <div key={c._id} className="alert alert-secondary">
                            {c.name}{" "}
                            <span className="btn btn-sm float-right"
                                onClick={() => handleRemove(c.slug)}>
                                <DeleteOutlined className="text-danger" />
                            </span>
                            <Link to={`/admin/sub/${c.slug}`}>
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

export default SubCreate;