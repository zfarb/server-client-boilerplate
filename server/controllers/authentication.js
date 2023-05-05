const jwt = require('jwt-simple');
const User = require('../models/User');
const keys = require('../config/keys');

// Function that takes a user and returns a corresponding json web token (jwt)
function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, keys.jwtSecret);
}

exports.signup = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        // Throw error if email AND password were not given
        if (!email || !password) {
            return res
                .status(422)
                .send({ error: 'Must provide email and password' });
        }

        // See if there is a user with the given email
        const existingUser = await User.findOne({ email: email });

        // If user with given email exists throw an error
        if (existingUser) {
            return res.status(422).send({ error: 'Email already exists' });
        }

        // If a user with the given email does not exist, create user record
        const user = new User({
            email,
            password
        });

        // Then save user record
        await user.save();

        // Respond to request with user jwt indicating the user was created
        res.json({ token: tokenForUser(user) });
    } catch (err) {
        return next(err);
    }
};

exports.signin = (req, res, next) => {
    // Send token
    res.send({ token: tokenForUser(req.user) });
};
