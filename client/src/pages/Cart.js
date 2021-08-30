import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import ProductCardInCheckout from '../components/Cards/ProductCardInCheckout';
import { userCart } from '../functions/user';

const Cart = ({ history }) => {
    const { cart, user } = useSelector((state) => ({ ...state }));
    const dispatch = useDispatch();

    const getTotal = () => {
        return cart.reduce((currentValue, nextValue) => {
            return currentValue + nextValue.count * nextValue.price;
        }, 0);
    }

    const saveOrderToDb = () => {
        userCart(cart, user.token).then((res) => {
            if (res.data.ok) history.push('/checkout')
        }).catch(err => {
            console.log('cart save err', err)
        })
    }

    const saveCashOrderToDb = () => {
        dispatch({
            type: "COD",
            payload: true,
        })

        userCart(cart, user.token).then((res) => {
            if (res.data.ok) history.push('/checkout')
        }).catch(err => {
            console.log('cart save err', err)
        })
    }

    const showCartItems = () => (
        <table className="table table-bordered">
            <thead className="thead-light">
                <tr>
                    <th scope="col">Image</th>
                    <th scope="col">Title</th>
                    <th scope="col">Price</th>
                    <th scope="col">Brand</th>
                    <th scope="col">Color</th>
                    <th scope="col">Count</th>
                    <th scope="col">Shipping</th>
                    <th scope="col">Remove</th>
                </tr>
            </thead>
            {
                cart.map((p) => (
                    <ProductCardInCheckout key={p._id} p={p} />
                ))
            }
        </table>
    )

    return (<div className="container-fluid">
        <div className="row">
            <div className="col-md-8">
                <h4>
                    Cart / {cart.length} Product
                </h4>

                {cart.length ?
                    (
                        showCartItems()
                    ) : (
                        <p>No products in cart. <Link to='/shop'>Continue shopping</Link></p>
                    )
                }
            </div>
            <div className="col-md-4">
                <h4>Order summary</h4>
                <hr />
                <p>Products</p>
                {cart.map((c, i) => (
                    <div key={i}>
                        <p>{c.title} x {c.count} = ${c.price * c.count}</p>
                    </div>
                ))}
                <hr />
                Total: <b>${getTotal()}</b>
                <hr />
                {
                    user ?
                        (
                            <>
                                <button onClick={saveOrderToDb}
                                    className="btn btn-sm btn-primary mt-2"
                                    disabled={!cart.length}>
                                    Proceed to checkout
                                </button>
                                <br />
                                <button onClick={saveCashOrderToDb}
                                    className="btn btn-sm btn-warning mt-2"
                                    disabled={!cart.length}>
                                    Pay Cash On Delivery
                                </button>
                            </>

                        ) : (
                            <button className="btn btn-sm btn-primary mt-2">
                                {/*Here is the logic to redirect from login to cart page */}
                                <Link to={{
                                    pathname: "/login",
                                    state: { from: "cart" }, //here state is not redux state
                                }}>
                                    Login to checkout
                                </Link>
                            </button>
                        )
                }
            </div>
        </div>
    </div>)
};

export default Cart;