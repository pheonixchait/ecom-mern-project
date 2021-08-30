import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

import { createOrUpdateUser } from '../../functions/auth'

const RegisterComplete = ({ history }) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        /*         console.log(window.localStorage.getItem('emailForRegistration'));
                console.log(window.location.href); */
        setEmail(window.localStorage.getItem('emailForRegistration'));
    }, []);

    let dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Please enter your credentials");
            return;
        }
        if (password.length < 6) {
            toast.error("Password should be of atleast 6 characters");
            return;
        }
        try {
            const result = await auth.signInWithEmailLink(email, window.location.href);
            console.log(result);

            if (result.user.emailVerified) {
                // Remove email from local storage
                window.localStorage.removeItem('emailForRegistration');
                // get user id token
                let user = auth.currentUser; // no need to store user in local storage
                await user.updatePassword(password);
                const idTokenResult = await user.getIdTokenResult();
                console.log("user", user, "token", idTokenResult);
                // redux store
                createOrUpdateUser(idTokenResult.token)
                    .then((res) => {
                        dispatch({
                            type: "REGISTERED_IN_USER",
                            payload: {
                                name: res.data.name,
                                email: res.data.email,
                                token: idTokenResult.token,
                                role: res.data.role,
                                _id: res.data._id,
                            }
                        });
                    })
                    .catch(err => console.log(err))
                // redirect
                history.push("/");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const CompleteRegistertionForm = () => (
        <form onSubmit={handleSubmit}>

            <div className="form-group">
                <input type="email" className="form-control" value={email} disabled />
            </div>

            <div className="form-group">
                <input type="password" className="form-control" placeHolder="Password" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus />
            </div>

            <button type="submit" className="btn btn-raised">
                Complete Registration
            </button>

        </form>
    )
    return (
        <div className="container p-5">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h4>Set Up Password</h4>
                    {CompleteRegistertionForm()}
                </div>
            </div>
        </div>
    );
}

export default RegisterComplete;