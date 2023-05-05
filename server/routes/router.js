const passport = require('passport');
const Authentication = require('../controllers/authentication');
const passportService = require('../services/passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = (app) => {
    app.get('/', requireAuth, (req, res) => {
        res.send('Authenticated');
    });

    app.get(
        '/auth/google',
        passport.authenticate('google', {
            scope: ['profile', 'email']
        })
    );

    app.get('/auth/google/callback', async (req, res, next) => {
        passport.authenticate('google', async (err, userData) => {
            if (err) {
                return next(err);
            }

            // Send the JWT back to the client
            res.send(
                `<script>localStorage.setItem('token', '${userData.token}');window.location.href = '/feature';</script>`
            );
        })(req, res, next);
    });

    app.post('/signup', Authentication.signup);
    app.post('/signin', requireSignin, Authentication.signin);
};
