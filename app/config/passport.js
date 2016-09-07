var LocalStrategy       = require('passport-local').Strategy;

module.exports = function(passport,User) {

    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // REGISTRAZIONE CON E-MAIL
    passport.use(

        'local-signup', 
        
        new LocalStrategy(
            
            {
                usernameField : 'email',
                passwordField : 'password',
                passReqToCallback : true 
            },

            function(req, email, password, done) {

                process.nextTick(function() {

                    User.findOne({ 'email' :  email }, function(err, user) {
                        
                        if (err) return done(err);

                        if (user) {

                            return done(null, false, req.flash('signinMessage', 'You are already registered!'));

                        } else {

                            var newUser             = new User();
                            newUser.fullName        = req.body.name || '';
                            newUser.email           = email;
                            newUser.local.password  = newUser.generateHash(password);
                            
                            newUser.save(function(err) {
                                if (err) throw err;
                                return done(null, newUser);
                            });
                        }

                    });    

                });
            }
        )
    );

    // LOGIN CON E-MAIL
    passport.use(

        'local-login',

        new LocalStrategy(
            {
                usernameField : 'email',
                passwordField : 'password',
                passReqToCallback : true 
            },
            function(req, email, password, done) { 

                User.findOne({ 'email' :  email }, function(err, user) {

                    if (err) return done(err);

                    if (!user) {
                        return done(null, false, req.flash('signinMessage', 'Your username or password is incorrect!')); 
                    }

                    if (!user.validPassword(password)) {
                        return done(null, false, req.flash('signinMessage', 'Your password or username is incorrect!')); 
                    }

                    return done(null, user);
                });

            }
        )
    );



};