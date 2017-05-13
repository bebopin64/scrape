var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var exphbs  = require('express-handlebars');

PORT = 1337;

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static('public'));

var routes = require('./controllers/controller.js');
app.use('/', routes);

app.listen(PORT, function() {
	console.log("listening on port: " + PORT);
});
