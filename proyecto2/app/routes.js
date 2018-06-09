// app/routes.js

module.exports = function(app, passport) {

    // route for home page
    app.get('/', function(req, res) {
        res.render('index.twig', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // route for showing the profile page
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.twig', {
            user : req.user // get the user out of session and pass to template
        });
    });
    
    // route para menejar los estilos por el usario
    app.get('/estilo', isLoggedIn, function(req, res) {
        res.render('estilo.twig', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // route for logging out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // facebook routes
    // twitter routes

    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
        // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
            passport.authenticate('google', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

require('./models/user');
