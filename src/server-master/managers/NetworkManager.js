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
var nunjucks = require('nunjucks');

var ApiManager = require('./ApiManager');

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

    //

    this.app.use( cookieParser() );
    this.app.use( bodyParser.urlencoded({ extended: false }) );
    this.app.use( passport.initialize() );
    this.app.use( passport.session() );

    // setuping fb-passport for login sys

    this.app.use( session({
        secret: 'aloha secret unicorns06',
        maxAge: new Date( Date.now() + 365 * 24 * 3600000 ), // 1 year
        resave: true,
        saveUninitialized: true,
        store: new MongoStore( { mongooseConnection: DB.mongoose.connection }, function ( err ) {

            console.log( err || 'connect-mongodb setup ok' );

        })
    }) );

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

            return done( null, profile );

        });

    }));

    nunjucks.configure( __dirname + '/../../client/views', {
        autoescape: true,
        express: this.app
    });

    this.app.get( '/', function ( req, res ) {

        var pid = req.cookies['dt-pid'];
        var sid = req.cookies['dt-sid'];

        if ( ! pid || ! sid ) {

            DT.playerManager.register( ( params ) => {

                res.cookie( 'dt-pid', params.pid, { maxAge: 900000 });
                res.cookie( 'dt-sid', params.sid, { maxAge: 900000 });
                return res.render( 'index.html', params );

            });

        } else {

            DT.playerManager.auth( pid, sid, ( params ) => {

                res.cookie( 'dt-pid', params.pid, { maxAge: 900000 });
                res.cookie( 'dt-sid', params.sid, { maxAge: 900000 });
                return res.render( 'index.html', params );

            });

        }

    });

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
        res.clearCookie('dt-pid');
        res.clearCookie('dt-sid');
        res.redirect('/');

    });

    // handling requests from clients

    this.app.get( '/api/stats', ApiManager.getStats );
    this.app.get( '/api/getFreeArena', ApiManager.getFreeArena );
    this.app.get( '/api/getTopPlayers', ApiManager.getTopPlayers );
    this.app.get( '/api/garage/getObjects', ApiManager.getGarageObjects );
    this.app.get( '/api/user/:uid/:oid/buyObject', ApiManager.buyObject );

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
