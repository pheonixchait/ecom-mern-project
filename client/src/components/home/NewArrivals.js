import React, { useEffect, useState } from "react";
import { getProducts, getProductsCount } from '../../functions/product'
import ProductCard from '../Cards/ProductCard'
import LoadingCard from '../Cards/LoadingCard'
import { Pagination } from 'antd'

const NewArrivals = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [productsCount, setProductsCount] = useState(0)

    useEffect(() => {
        loadAllProducts()
    }, [page])

    useEffect(() => { //this useEffect will run after the previous useEffect
        getProductsCount()
            .then((res) => {
                setProductsCount(res.data)
            })
    }, [])

    const loadAllProducts = () => {
        setLoading(true)
        getProducts('createdAt', 'desc', page)
            .then((res) => {
                setLoading(false)
                setProducts(res.data)
            })
            .catch((err) => {
                setLoading(false)
                console.log(err)
            })
    }

    return (
        <>
            <div className="container">
                {loading ? <LoadingCard count={products.length} /> :
                    <div className="row">
                        {
                            products.map((product) => (
                                <div key={product._id} className="col-md-4">
                                    <ProductCard
                                        product={product}
                                    />
                                </div>
                            ))
                        }
                    </div>
                }
            </div>

            <div className="row">
                <div className="col-md-4 offset-md-4 pt-2 p-3 text-center">
                    <Pagination
                        current={page}
                        total={(productsCount / 3) * 10}
                        onChange={(value) => setPage(value)}
                    />
                </div>
            </div>
        </>
    );
}

export default NewArrivals;