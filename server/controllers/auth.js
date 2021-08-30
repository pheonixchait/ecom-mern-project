const User = require('../models/user')

//here we are exporting single single function
exports.createOrUpdateUser = async (req, res) => {
    const { name, email, picture } = req.user; //here error handling is not done as of if the token is proper or does that token have user

    const user = await User.findOneAndUpdate(
        { email },
        { name: email.split('@')[0], picture },
        { new: true },
    );

    if (user) {
        console.log('UPDATED USER: ', user);
        res.json(user);
    } else {
        const newUser = await new User({
            email,
            name: email.split('@')[0],
            picture,
        }).save();
        console.log('CREATED USER: ', newUser);
        res.json(newUser);
    }
};

exports.currentUser = async (req, res) => {
    User.findOne({ email: req.user.email }).exec((error, user) => {
        if (error) throw new Error(error);
        res.json(user);
    })
};