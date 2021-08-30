import React, { useState } from "react"
import UserNav from "../../components/nav/UserNav"
import { auth } from '../../firebase'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import AdminNav from "../../components/nav/AdminNav"

const Password = () => {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const { user } = useSelector((state) => ({ ...state }));

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true) //await used to not return the promise until the code in front of await is not returned
        await auth.currentUser
            .updatePassword(password)
            .then(() => {
                setLoading(false)
                setPassword("")
                toast.success("password updated successfully")
            })
            .catch((err) => {
                setLoading(false)
                toast.error(err.message)
            })
    }

    const passwordUpdateForm = () => <form>
        <div className="form-group">
            <label>Your Password</label>
            <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                placeholder="Your new password"
                disabled={loading}
                value={password}
            />
            <button className="btn btn-primary" onClick={handleSubmit} disabled={!password || password.length < 6 || loading}>Submit</button>
        </div>
    </form>

    return (
        <div className="container-fluid">
            <div className="row">
                {/* below code is written because we are using this password page for both admin and user hence nav bar in here needs to be conditional */}
                {user && user.role === "subscriber" && <div className="col-md-2"><UserNav /></div>}
                {user && user.role === "admin" && <div className="col-md-2"><AdminNav /></div>}

                <div className="col">
                    {loading ? (
                        <h4 className="text-danger">Loading...</h4>
                    ) : (
                            <h4>user password page</h4>
                        )}
                    {passwordUpdateForm()}
                </div>
            </div>
        </div>
    )
};

export default Password;