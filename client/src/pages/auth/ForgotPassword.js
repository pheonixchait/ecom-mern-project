import React, { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const ForgotPassword = ({ history }) => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const { user } = useSelector((state) => ({ ...state }));

    useEffect(() => {
        if (user && user.token) {
            history.push("/");
        }
    }, [user, history])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const config = {
            url: process.env.REACT_APP_FORGOT_PASSWORD_REDIRECT_URL,
            handleCodeInApp: true,
        };

        await auth.sendPasswordResetEmail(email, config)
            .then(() => {
                setEmail("");
                setLoading(false);
                toast.success("Check your email for password reset link!");
            })
            .catch((error) => {
                console.log(error);
                toast.error(error.message);
                setLoading(false);
            })
    }

    return <div className="col-md-6 offset-md-3 p-5">
        {loading ? (<h4 className="text-danger">Loading.....</h4>) : (<h4>Set up new password</h4>)}

        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus
                    placeholder="Your Email" />
            </div>
            <button className="btn btn-raised" disabled={!email}>Submit</button>
        </form>
    </div>
}

export default ForgotPassword;