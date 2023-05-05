const jwt = require('jwt-simple');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const localStrategy = require('passport-local');
const jwtStrategy = require('passport-jwt').Strategy;
const extractJWT = require('passport-jwt').ExtractJwt;
const User = require('../models/User');
const keys = require('../config/keys');

// Function that takes a user and returns a corresponding json web token (jwt)
function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, keys.jwtSecret);
}

// Create local strategy
const localLogin = new localStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
        try {
            // Check if user with email exists
            const existingUser = await User.findOne({ email: email });

            // If user does not exist, call 'done' with false
            if (!existingUser) {
                return done(null, false);
            }

            // Else check if password equal to user.password
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
        // Check if user with userId from payload exists
        const existingUser = await User.findById(payload.sub);

        // If user does not exist, call 'done' with false
        if (!existingUser) {
            done(null, false);
        }

        // Else call 'done' with the user object
        else {
            done(null, existingUser);
        }
    } catch (err) {
        return done(err, false);
    }
});

// Create Google Strategy
const googleLogin = new GoogleStrategy(
    {
        clientID: keys.googleClientId,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user with googleId exits
            const existingUser = await User.findOne({ googleId: profile.id });

            // If user does not exist, save new user, generate token and call 'done' with the user object and token
            if (!existingUser) {
                const newUser = await new User({ googleId: profile.id }).save();
                const token = tokenForUser(newUser);
                done(null, { user: newUser, token });
            }

            // Else generate token and call 'done' with the user object and token
            const token = tokenForUser(existingUser);
            return done(null, { user: existingUser, token });
        } catch (err) {
            done(err, false);
        }
    }
);

// Tell passport to use the JWT Strategy
passport.use(jwtLogin);

// Tell passport to use localLogin Strategy
passport.use(localLogin);

// Tell passport to use Google Strategy
passport.use(googleLogin);
