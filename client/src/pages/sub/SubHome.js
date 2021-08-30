import React, { useEffect, useState } from 'react'
import { getSub } from '../../functions/sub'
import ProductCard from '../../components/Cards/ProductCard'
import { Link } from 'react-router-dom'

const SubHome = ({ match }) => {
    const [sub, setSub] = useState([])
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)

    const { slug } = match.params

    useEffect(() => {
        setLoading(true)
        getSub(slug)
            .then((c) => {
                console.log(JSON.stringify(c.data, null, 4)) // logging json data in more formatted way
                setSub(c.data.sub)
                setProducts(c.data.products)
                setLoading(false)
            })
    }, [])

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col">
                    {
                        loading ? (
                            <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">Loading...</h4>
                        ) :
                            (
                                <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">{products.length} products in "{sub.name}" sub-category</h4>
                            )
                    }
                </div>
            </div>

            <div className="row">
                {
                    products.map((p) => (
                        <div className="col-md-4" key="p_id">
                            <ProductCard product={p} />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default SubHome