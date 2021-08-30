import React from 'react'
import { Drawer, Button } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import laptop from '../../images/laptop.jpg'

const SideDrawer = ({ children }) => {
    const dispatch = useDispatch();
    const { drawer, cart } = useSelector((state) => ({ ...state }))

    const imageStyle = {
        width: '100%',
        height: '50px',
        objectFit: 'cover',
    }

    return <Drawer
        className="text-center"
        title={`Cart / ${cart.length} Product`}
        closable={false}
        onClose={
            () => {
                dispatch({
                    type: "SET_VISIBLE",
                    payload: false,
                })
            }
        }
        visible={drawer}
    >
        {
            cart.map((p) => (
                <div key={p._id} className="row">
                    <div className="col">
                        {p.images.length > 0 ? (
                            <>
                                <img src={p.images[0].url} style={imageStyle} />
                                <p className="text-center bg-secondary text-light">{p.title} X {p.count}</p>
                            </>
                        ) : (
                            <>
                                <img src={laptop} style={imageStyle} />
                                <p className="text-center bg-secondary text-light">{p.title} X {p.count}</p>
                            </>
                        )}
                    </div>
                </div>
            ))
        }

        <Link to="/cart">
            <button
                onClick={
                    () => {
                        dispatch({
                            type: "SET_VISIBLE",
                            payload: false,
                        })
                    }
                }
                className="text-center btn  btn-primary btn-raised btn-blocked"
            >
                Go To Cart
            </button>
        </Link>
    </Drawer>
}

export default SideDrawer;