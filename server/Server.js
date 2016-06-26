/*
 * @author ohmed
 * basic start server
*/

var PORT = 8082;

var express = require('express');
var app = express();

app.use( express.static( './../www') );
app.use( '/terms', express.static( './../www/terms.html') );
app.use( '/policy', express.static( './../www/policy.html') );
app.use( '/changelog', express.static( './../www/changelog.html') );
app.use( '/*', express.static( './../www/notfound.html') );

//

require('./Global');

//

app.listen( PORT );
DT.Network.init();

//

console.log( '> Started server on port ' + PORT );