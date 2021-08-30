const admin = require('../firebase')
const User = require('../models/user')

exports.authCheck = async (req, res, next) => {
    //console.log(req.headers) 
    //note the use of res instead of req, here where you put req and res in parameters decide what is req, i.e. req is first parameter and res is second
    try {
        const firebaseUser = await admin
            .auth()
            .verifyIdToken(req.headers.authtoken)
        console.log("FIREBASE USER IN AUTHCHECK", firebaseUser)
        req.user = firebaseUser
        next() //never forget to call callback function
    } catch (err) { //always catch errors
        res.status(401).json({
            err: "Invalid or expired Token.",
        })
    }
}

exports.adminCheck = async (req, res, next) => {
    const { email } = req.user; //here the email field get's extracted out of user object

    //look how we used user object here instead of calling it in any controller function like that in user, cuz we don't want it to go further deep in server if it's not coming from admin 
    const adminUser = await User.findOne({ email }).exec();

    if (adminUser.role !== 'admin') {
        res.status(403).json({
            err: "Admin resource! Access denied",
        })
    } else {
        next()
    }
}