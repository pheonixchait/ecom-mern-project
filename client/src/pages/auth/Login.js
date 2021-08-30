import React, { useState, useEffect } from "react";
import { Button } from 'antd';
import { MailOutlined, GoogleOutlined } from '@ant-design/icons';
import { auth, googleAuthProvider } from "../../firebase";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux"
import { Link } from 'react-router-dom'

import { createOrUpdateUser } from '../../functions/auth'

const Login = ({ history }) => {

    const [email, setEmail] = useState("londhechait@gmail.com");
    const [password, setPassword] = useState("zxcvbn");
    const [loading, setLoading] = useState(false);

    const { user } = useSelector((state) => ({ ...state }));

    let intended = history.location.state

    useEffect(() => {
        if (intended) { // actually there is no need for this check but still, refer 133 for more details
            return
        } else {
            if (user && user.token) { // to restrict user from accessing login page after logged in
                history.push("/");
            }
        }
    }, [user, history])

    let dispatch = useDispatch();

    const roleBasedRedirect = (res) => {
        //check if intended redirect is there i.e...if we want to show cart page after user logs in..login to checkout fuctionality

        if (intended) {
            history.push(intended.from)
        } else {
            if (res.data.role === "admin") {
                history.push("/admin/dashboard");
            } else {
                history.push("/user/history");
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await auth.signInWithEmailAndPassword(email, password);
            //console.log(result);
            const { user } = result;
            const idTokenResult = await user.getIdTokenResult();

            createOrUpdateUser(idTokenResult.token)
                .then((res) => {
                    dispatch({
                        type: "LOGGED_IN_USER",
                        payload: {
                            name: res.data.name,
                            email: res.data.email,
                            token: idTokenResult.token,
                            role: res.data.role,
                            _id: res.data._id,
                        }
                    });
                    roleBasedRedirect(res);
                })
                .catch(err => console.log(err))
            /*             dispatch({
                            type: "LOGGED_IN_USER",
                            payload: {
                                email: user.email,
                                token: idTokenResult.token,
                            }
                        });*/
            //history.push("/");
        } catch (error) {
            console.log(error);
            toast.error(error.message);
            setLoading(false);
        }
    }

    const googleLogin = async () => {
        auth.signInWithPopup(googleAuthProvider)
            .then(async (result) => {
                const { user } = result;
                const idTokenResult = await user.getIdTokenResult();

                /*                 dispatch({
                                    type: "LOGGED_IN_USER",
                                    payload: {
                                        email: user.email,
                                        token: idTokenResult.token,
                                    },
                                }); */
                createOrUpdateUser(idTokenResult.token)
                    .then((res) => {
                        dispatch({
                            type: "LOGGED_IN_USER",
                            payload: {
                                name: res.data.name,
                                email: res.data.email,
                                token: idTokenResult.token,
                                role: res.data.role,
                                _id: res.data._id,
                            }
                        });
                    })
                    .catch()
                history.push("/");
            })
            .catch((error) => {
                console.log(error);
                toast.error(error.message);
                setLoading(false);
            });

    };

    const loginForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus
                    placeholder="Your Email" />
            </div>

            <div className="form-group">
                <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus
                    placeholder="Password" />
            </div>

            <br />
            <Button type="primary" onClick={handleSubmit} className="mb-3" block shape="round" icon={<MailOutlined />} size="large"
                disabled={!email || password.length < 6}>
                Login with Email/Password
            </Button>
            <Button type="danger" onClick={googleLogin} className="mb-3" block shape="round" icon={<GoogleOutlined />} size="large"
                disabled={!email}>
                Login with Google
            </Button>

            <Link to="forgot/password" className="float-right text-danger">Forgot Password?</Link>
        </form>
    )
    return (
        <div className="container p-5">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    {loading ? (<h4 className="text-danger">Loading.....</h4>) : (<h4>Login</h4>)}
                    {loginForm()}
                </div>
            </div>
        </div>
    );
}

export default Login;