const passport = require('passport');
const jwtStrategy = require('passport-jwt').Strategy;
const extractJWT = require('passport-jwt').ExtractJwt;
const localStrategy = require('passport-local');
const User = require('../models/User');
const keys = require('../config/keys');

// Create local strategy
const localLogin = new localStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
        try {
            console.log('Email: ', email);
            console.log('Password: ', password);
            // Verify email and password
            const existingUser = await User.findOne({ email: email });

            // If user does not exist, call 'done' with false
            if (!existingUser) {
                return done(null, false);
            }

            // Check if password equal to user.password
            existingUser.comparePassword(password, (err, isMatch) => {
                if (err) {
                    return done(err);
                }

                if (!isMatch) {
                    return done(null, false);
                }

                // If correct email and password call done call done with the user object
                return done(null, existingUser);
            });
        } catch (err) {
            return done(err);
        }
    }
);

// Set up options for JWT Strategy
const jwtOptions = {
    jwtFromRequest: extractJWT.fromHeader('authorization'),
    secretOrKey: keys.jwtSecret
};

// Create JWT Strategy
const jwtLogin = new jwtStrategy(jwtOptions, async (payload, done) => {
    try {
        // Check if user ID in the payload exists in database
        const existingUser = await User.findById(payload.sub);

        // If user ID exists in database, call 'done' with that user object
        if (existingUser) {
            done(null, existingUser);
        }

        // Else call 'done' without a user object
        else {
            done(null, false);
        }
    } catch (err) {
        return done(err, false);
    }
});

// Tell passport to use the JWT Strategy
passport.use(jwtLogin);

// Tell passport to use localLogin Strategy
passport.use(localLogin);
