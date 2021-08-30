import React, { useState, useEffect } from 'react'
import { getUserCart, emptyCart, saveUserAddress, applyCoupon, createCashOrderForUser } from '../functions/user';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'

const Checkout = ({ history }) => {
    const { user, COD } = useSelector((state) => ({ ...state }));
    const couponTrueOrFalse = useSelector((state) => state.coupon);
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [address, setAddress] = useState('');
    const [addressSaved, setAddressSaved] = useState(false);
    const [coupon, setCoupon] = useState('');
    const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
    const [discountError, setDiscountError] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        getUserCart(user.token).then((res) => {
            setProducts(res.data.products);
            setTotal(res.data.cartTotal);
        })
    }, []);

    const handleEmptyCart = () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("cart");
        }
        dispatch({
            type: "ADD_TO_CART",
            payload: [],
        })

        emptyCart(user.token).then(res => {
            setProducts([]);
            setTotal(0);
            setTotalAfterDiscount(0);
            setCoupon("");
            toast.success("Cart is empty, continue shopping")
        })
    }

    const saveAddressToDb = () => {
        saveUserAddress(address, user.token).then(res => {
            if (res.data.ok) {
                setAddressSaved(true);
                toast.success("Address Saved")
            }
        })
    }

    const applyDiscountCoupon = () => {
        applyCoupon(coupon, user.token).then(res => {
            if (res.data) {
                setTotalAfterDiscount(res.data);
                //update redux coupon applied
                dispatch({
                    type: "COUPON_APPLIED",
                    payload: true
                })
            }

            if (res.data.err) {
                setDiscountError(res.data.err);
                //update redux coupon applied
                dispatch({
                    type: "COUPON_APPLIED",
                    payload: false
                })
            }
        })
    }

    const showAddress = () => (
        <>
            <ReactQuill theme="snow" value={address} onChange={setAddress} />
            <button className="btn btn-primary mt-2" onClick={saveAddressToDb}>Save</button>
        </>
    )

    const showProductSummary = () => products.map((p, i) => (
        <div key={i}>
            <p>
                {p.product.title} {p.color} x {p.count} = {" $"}{p.product.price * p.count}
            </p>
        </div>
    ))

    const showApplyCoupon = () => (
        <>
            <input
                onChange={(e) => {
                    setCoupon(e.target.value);
                    setDiscountError("");
                }}
                value={coupon}
                type="text"
                className="form-control"
            />
            <button onClick={applyDiscountCoupon} className="btn btn-primary mt-2">Apply</button>
        </>
    )

    const createCashOrder = () => {
        //no need for COD parameter
        console.log("coupon", couponTrueOrFalse);
        createCashOrderForUser(user.token, COD, couponTrueOrFalse).then(res => {
            console.log('USER CASH ORDER CREATED', res);
            //empty cart from redux, localstorage, reset coupon, cod, redirect,
            if (res.data.ok) {
                //empty local storage
                if (typeof window !== 'undefined') localStorage.removeItem('cart');
                //empty redux cart
                dispatch({
                    type: "ADD_TO_CART",
                    payload: [],
                })
                //empty redux coupon
                dispatch({
                    type: "COUPON_APPLIED",
                    payload: false,
                })
                //empty COD
                dispatch({
                    type: "COD",
                    payload: false,
                })
                //empty cart from backend
                emptyCart(user.token);
                //redirect
                setTimeout(() => {
                    history.push('/user/history')
                }, 1000)
            }
        })
    }

    return (
        <div className="row">
            <div className="col-md-6">
                <h4>Delivery address</h4>
                <br />
                <br />
                {showAddress()}
                <hr />
                <h4>Got Coupon?</h4>
                <br />
                {showApplyCoupon()}
                <br />
                {discountError && <p className="bg-danger p-2">{discountError}</p>}
            </div>

            <div className="col-md-6">
                <h4> Order Summary</h4>
                <hr />
                <p>products  {products.length}</p>
                <hr />
                {showProductSummary()}
                <hr />
                <p>Cart total: ${total}</p>

                {
                    totalAfterDiscount > 0 && (
                        <p className="bg-success p-2">
                            Discount applied: Total payable ${totalAfterDiscount}
                        </p>
                    )
                }

                <div className="row">
                    <div className="col-md-6">
                        {
                            COD ? (
                                <button disabled={!products.length || !addressSaved} className="btn btn-primary" onClick={createCashOrder}>Place order</button>
                            ) :
                                (
                                    <button disabled={!products.length || !addressSaved} className="btn btn-primary" onClick={() => history.push('/payment')}>Place order</button>
                                )
                        }

                    </div>
                    <div className="col-md-6">
                        <button disabled={!products.length} onClick={handleEmptyCart} className="btn btn-primary">Empty cart</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout