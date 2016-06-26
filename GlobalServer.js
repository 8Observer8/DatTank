var http = require('http'),  
    httpProxy = require('http-proxy'),
    proxy = httpProxy.createProxyServer({}),
    url = require('url');

http.createServer( function ( req, res ) {

    var hostname = req.headers.host.split(":")[0];
    var pathname = url.parse( req.url ).pathname;

    switch ( hostname ) {

        case 'nwgstudios.com':

            proxy.web(req, res, { target: 'http://localhost:8081' });
            break;

        case 'dattank.com':
            proxy.web(req, res, { target: 'http://localhost:8082' });
            break;

        default:

            proxy.web(req, res, { target: 'http://localhost:8081' });

    }

}).listen( 80, function () {

    console.log('proxy listening on port 80');

});

proxy.on( 'error', function ( error, req, res ) {

    var json;
    console.log('proxy error', error);
    if (!res.headersSent) {
        res.writeHead(500, { 'content-type': 'application/json' });
    }

    json = { error: 'proxy_error', reason: error.message };
    res.end(JSON.stringify(json));

});
