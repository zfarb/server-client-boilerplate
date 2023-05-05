const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

// Define the user model
const userSchema = new Schema({
    email: { type: String, unique: true, lowercase: true },
    password: String,
    googleId: String
});

// Before saving the user model, run this function to validate that either (email and password) or (googleId) were given
userSchema.pre('validate', function (next) {
    // Check if email is given then password is also given and vice versa
    if (this.email && !this.password) {
        next(new Error('Password must be provided'));
    } else if (this.password && !this.email) {
        next(new Error('Email must be provided'));
    }

    // Else assume googleId is being used, continue
    else {
        next();
    }
});

// Before saving the user model, run this function to encrypt the password
userSchema.pre('save', function (next) {
    // Get access to the user model
    const user = this;

    // If no password is given assume googleId is being used, continue
    if (!user.password) {
        return next();
    }

    // Generate a salt, then run callback function
    bcrypt.genSalt(10, function (err, salt) {
        if (err) {
            return next(err);
        }

        // Hash (encrypt) password using the salt
        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) {
                return next(err);
            }

            // Overwrite password with hash (encrypted password)
            user.password = hash;
            next();
        });
    });
});

// Create compare passwords method for users
userSchema.methods.comparePassword = function (password, callback) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        if (err) {
            return callback(err);
        }

        callback(null, isMatch);
    });
};

// Create user model class
const UserClass = mongoose.model('user', userSchema);

// Export the user model
module.exports = UserClass;
