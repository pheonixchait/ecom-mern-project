import React, { useEffect, useState } from 'react'
import { getProduct, productStar, getRelated } from '../functions/product'
import SingleProduct from '../components/Cards/SingleProduct'
import { useSelector } from 'react-redux'
import ProductCard from '../components/Cards/ProductCard'

const Product = ({ match }) => {
    const { user } = useSelector((state) => ({ ...state }))
    const [product, setProduct] = useState({})
    const { slug } = match.params
    const [star, setStar] = useState(0)
    const [related, setRelated] = useState([])

    useEffect(() => {
        loadSingleProduct()
    }, [slug])

    useEffect(() => {
        if (product.ratings && user) {
            let existingRatingObject = product.ratings.find((ele) => ele.postedBy.toString() === user._id.toString())
            existingRatingObject && setStar(existingRatingObject.star)
        }
    })

    const loadSingleProduct = () => {
        getProduct(slug)
            .then((res) => {
                setProduct(res.data)

                //load related
                getRelated(res.data._id)
                    .then((relatedRes) => {
                        setRelated(relatedRes.data)
                    })
            })
    }

    const onStarClick = (newRating, name) => {
        setStar(newRating)
        productStar(name, newRating, user.token).then((res) => {
            console.log(res)
            loadSingleProduct()
        })
    }

    return (
        <div className="Container-fluid">
            <div className="row pt4">
                <SingleProduct product={product} onStarClick={onStarClick} star={star}></SingleProduct>
            </div>

            <div className="row">
                <div className="col text-center pt-5 pb-5">
                    <hr />
                    <h4>Related Products</h4>
                    <hr />
                </div>
            </div>

            <div className="row pb-5">
                {
                    related.length ? related.map((r) => (
                        <div key={r._id} className="col-md-4">
                            <ProductCard product={r} />
                        </div>
                    )) :
                        <div className="text-center col">No products found</div>
                }
            </div>
        </div >
    )
}

export default Product

