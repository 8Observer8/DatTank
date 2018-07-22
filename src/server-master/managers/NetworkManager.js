/*
 * @author ohmed
 * DatTank master-server network manager
*/

var http = require('http');
var express = require('express');
var compression = require('compression');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var MongoStore = require('connect-mongo')( session );

//

var NetworkManager = function () {

    this.app = false;
    this.server = false;

    //

    this.init();

};

NetworkManager.prototype = {};

//

NetworkManager.prototype.init = function () {

    this.app = express();
    this.server = http.createServer( this.app );

    // setuping fb-passport for login sys

    this.app.use( session({
        secret: 'awesome unicorns',
        maxAge: new Date( Date.now() + 3600000 ),
        store: new MongoStore(
            { mongooseConnection: DB.mongoose.connection },
            function ( err ) {
                console.log( err || 'connect-mongodb setup ok' );
            })
    }));

    passport.serializeUser( function ( user, done ) {

        done( null, user );

    });

    passport.deserializeUser( function ( obj, done ) {

        done( null, obj );

    });

    passport.use( new FacebookStrategy({
        clientID: environment.fbApp.key,
        clientSecret: environment.fbApp.secret,
        callbackURL: environment.fbApp.cbUrl
    }, function ( accessToken, refreshToken, profile, done ) {
            
        process.nextTick( function () {
            //Check whether the User exists or not using profile.id
            //Further DB code.
            return done( null, profile );
        });

    }));

    this.app.use( cookieParser() );
    this.app.use( bodyParser.urlencoded({ extended: false }) );
    this.app.use( passport.initialize() );
    this.app.use( passport.session() );

    this.app.get( '/auth/facebook', passport.authenticate('facebook', { 
        scope : [ 'public_profile', 'email' ]
    }));

    this.app.get('/auth/facebook/callback', passport.authenticate( 'facebook', {
        failureRedirect: '/login'
    }), function ( req, res ) {

        var pid = req.cookies['dt-pid'];
        var sid = req.cookies['dt-sid'];
        var fbUser = req.user;

        DT.playerManager.linkFB( pid, sid, fbUser, ( pid, sid ) => {

            res.cookie( 'dt-pid', pid, { maxAge: 900000 });
            res.cookie( 'dt-sid', sid, { maxAge: 900000 });
            res.redirect('/');

        });

    });

    this.app.get( '/logout', function ( req, res ) {

        req.logout();
        res.redirect('/');

    });

    // handling requests from clients

    this.app.get( '/api/auth', function ( req, res ) {

        var pid = req.cookies['dt-pid'];
        var sid = req.cookies['dt-sid'];

        if ( ! pid || ! sid ) {

            DT.playerManager.register( ( params ) => {

                res.cookie( 'dt-pid', params.pid, { maxAge: 900000 });
                res.cookie( 'dt-sid', params.sid, { maxAge: 900000 });
                return res.send( params );

            });

        } else {

            DT.playerManager.auth( pid, sid, ( params ) => {

                res.cookie( 'dt-pid', params.pid, { maxAge: 900000 });
                res.cookie( 'dt-sid', params.sid, { maxAge: 900000 });
                return res.send( params );

            });

        }

    });

    this.app.get( '/api/stats', function ( req, res ) {

        var arenas = [];

        for ( var aid in DT.arenaServersManager.arenaServers ) {

            var arena = DT.arenaServersManager.arenaServers[ aid ];

            arenas.push({
                id:         arena.aid,
                ip:         arena.ip,
                players:    arena.players
            });

        }

        return res.send( arenas );

    });

    this.app.get( '/api/getFreeArena', function ( req, res ) {

        var arena = DT.arenaServersManager.getFreeServer();

        if ( ! arena ) {

            return res.send({ error: 1, 'message': 'No available arenas.' });

        } else {

            return res.send( arena );

        }

    });

    this.app.get( '/api/getTopPlayers', function ( req, res ) {

        DT.playerManager.getTopBoard( function ( playersTop ) {

            return res.send( playersTop );

        });

    });

    //

    this.app.use( compression() );
    this.app.use( express.static( __dirname + './../../client' ) );

    this.app.use( '/terms', express.static( __dirname + './../../сlient/terms.html') );
    this.app.use( '/policy', express.static( __dirname + './../../client/policy.html') );
    this.app.use( '/changelog', express.static( __dirname + './../../client/changelog.html') );
    this.app.use( '/*', express.static( __dirname + './../../client/notfound.html') );

    //

    this.server.listen( environment.web.port );

};

//

module.exports = NetworkManager;
