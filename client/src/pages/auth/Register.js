import React, { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const Register = ({ history }) => {

    const [email, setEmail] = useState("");

    const { user } = useSelector((state) => ({ ...state }));

    useEffect(() => {
        if (user && user.token) {
            history.push("/");
        }
    }, [user, history])

    const handleSubmit = async (e) => { //we have made this async, so that while registeration link is sent to user can access other components like home. 
        //also we are using await keyword which will show toast only when firebase has sent the link to user, and await can be used only with async functions.
        e.preventDefault();
        console.log("ENV---->", process.env.REACT_APP_REGISTER_REDIRECT_URL);
        const config = {
            url: process.env.REACT_APP_REGISTER_REDIRECT_URL,
            handleCodeInApp: true,
        };

        await auth.sendSignInLinkToEmail(email, config);
        toast.success(`Email is sent to {email}. Click the link to complete registration`); // this embedded variable is not working

        window.localStorage.setItem("emailForRegistration", email);

        setEmail("");
    }

    const registerForm = () => (
        <form onSubmit={handleSubmit}>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus
                placeholder="Your Email" />
            <br />
            <button type="submit" className="btn btn-raised">
                Register
            </button>
        </form>
    )
    return (
        <div className="container p-5">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h4>Register</h4>
                    {registerForm()}
                </div>
            </div>
        </div>
    );
}

export default Register;