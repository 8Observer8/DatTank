/*
 * @author ohmed
 * Ads controller
*/

Game.Ads = {
    count: 0,
    showedOnStart: false
};

Game.Ads.playAipPreroll = function ( endCallback ) {

    Game.Ads.count ++;
    Game.Ads.endCallback = endCallback;

    var lastActiveTime = + localStorage.getItem( 'lastActiveTime' );

    if ( ( Game.Ads.count === 2 && ! Game.Ads.showedOnStart ) || Game.Ads.count % 5 === 0 || ( Game.Ads.count === 2 && Date.now() - lastActiveTime < 35 * 1000 ) ) {

        if ( Game.Ads.count === 1 && Date.now() - lastActiveTime < 25 * 1000 ) {

            Game.Ads.showedOnStart = true;

        }

        ga('send', {
            hitType: 'event',
            eventCategory: 'ads',
            eventAction: 'started'
        });

        Game.Ads.endCallback();
        return;

        adplayer.startPreRoll();

    } else {

        Game.Ads.endCallback();

    }

};

Game.Ads.initAipPreroll = function () {

    if ( typeof aipPlayer != 'undefined' ) {

        adplayer = new aipPlayer({
            AD_WIDTH: 960,
            AD_HEIGHT: 540,
            AD_FULLSCREEN: true,
            PREROLL_ELEM: document.getElementById('preroll'),
            AIP_COMPLETE: function ()  {

                if ( Game.Ads.endCallback ) {

                    Game.Ads.endCallback();

                    ga('send', {
                        hitType: 'event',
                        eventCategory: 'ads',
                        eventAction: 'completed'
                    });

                }

            },
            AIP_REMOVE: function ()  {

                // Game.Ads.endCallback();

            }
        });

    } else {

        ga('send', {
            hitType: 'event',
            eventCategory: 'ads',
            eventAction: 'error'
        });

        // Failed to load the adslib ads are probably blocked
        // don't call the startPreRoll function.
        // it will result in an error.

    }

};

Game.Ads.initScript = function ( src, callback ) {

    var headElm = document.head || document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    var once = true;

    script.async = 'async';
    script.type = 'text/javascript';
    script.charset = 'UTF-8';
    script.src = src;

    script.onload = script.onreadystatechange = function () {

        if ( once && ( ! script.readyState || /loaded|complete/.test( script.readyState ) ) ) {

            once = false;
            callback();
            script.onload = script.onreadystatechange = null;

        }

    };

    headElm.appendChild(script);

};

Game.Ads.initScript( '//api.adinplay.com/player/v2/NWGS/dattank.com/player.min.js', Game.Ads.initAipPreroll );
