import React, { useState } from 'react'
import { Card, Tabs, Tooltip } from 'antd'
import { Link } from 'react-router-dom'
import { HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import laptop from '../../images/laptop.jpg'
import ProductListItems from '../Cards/ProductListItems'
import StarRating from 'react-star-ratings'
import RatingModal from '../modal/RatingModal'
import { showAverage } from '../../functions/rating'
import _ from 'loadsh'
import { useSelector, useDispatch } from 'react-redux'
import { addToWishlist } from '../../functions/user';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
const { Meta } = Card
const { TabPane } = Tabs

//this is children component of product
const SingleProduct = ({ product, onStarClick, star }) => {
    const { title, images, description, _id } = product

    const [tooltip, setTooltip] = useState('Click to add');
    const { user, cart } = useSelector((state) => ({ ...state }));
    const dispatch = useDispatch();

    let history = useHistory();

    const handleAddToCart = () => {

        let cart = [];
        if (typeof window !== "undefined") {
            // if cart is in local storage then get it
            if (localStorage.getItem("cart")) {
                cart = JSON.parse(localStorage.getItem("cart"))
            }
            // push new product to cart
            cart.push({
                ...product,
                count: 1,
            })
            // remove duplicate values
            let unique = _.uniqWith(cart, _.isEqual)
            //save to local storage
            localStorage.setItem("cart", JSON.stringify(unique));

            setTooltip('Added');

            dispatch({
                type: 'ADD_TO_CART',
                payload: unique,
            })
            //show cart items in side drawer
            dispatch({
                type: 'SET_VISIBLE',
                payload: true,
            })
        }
    }

    const handleAddToWishlist = (e) => {
        e.preventDefault();
        addToWishlist(product._id, user.token).then(res => {
            console.log('ADDED TO WISHLIST', res);
            toast.success('Added to wishlist');
            history.push("/user/wishlist");
        })
    }

    return (
        <>
            <div className="col-md-7">
                {
                    images && images.length > 0 ?
                        <Carousel showArrows={true} autoPlay infiniteLoop>
                            {images.map((image) => <img src={image.url} key={image.public_id} />)}
                        </Carousel> :
                        <Card cover={<img src={laptop} className="mb-3 card-img" />}></Card>
                }

                <Tabs type="card">
                    <TabPane tab="Description" key="1">
                        {description}
                    </TabPane>
                    <TabPane tab="Contact Us" key="2">
                        Call us on xxxx xxxx xx for more info
                    </TabPane>
                </Tabs>

            </div>

            <div className="col-md-5">
                <h1 className="bg-info p-3">{title}</h1>
                {product && product.ratings && product.ratings.length > 0 ?
                    showAverage(product) :
                    <div className="text-center pt-1 pb-3">No rating yet</div>}
                <Card
                    actions={
                        [
                            <Tooltip title={tooltip}>
                                <a onClick={handleAddToCart} disabled={product.quantity < 1}>
                                    <ShoppingCartOutlined className="text-success" />
                                    <br />
                                    {product.quantity < 1 ? 'Out of stock' : 'Add to Cart'}
                                </a></Tooltip>,
                            <a onClick={handleAddToWishlist}>
                                <HeartOutlined className="text-info" /> <br /> Add to Wishlist
                            </a>,
                            <RatingModal>
                                <StarRating
                                    name={_id}
                                    numberOfStars={5}
                                    rating={star}
                                    changeRating={onStarClick} // look how parent has access to the name parameter here 
                                    isSelectable={true}
                                    starRatedColor="red"
                                />
                            </RatingModal>
                        ]
                    }
                >
                    <ProductListItems product={product} />
                </Card>
            </div>
        </>
    )
}

export default SingleProduct