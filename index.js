var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var ParseDashboard = require('parse-dashboard');
var path = require('path');
var app = express();
var config = require('./app.config.json');

var api = new ParseServer({
  // Connection string for your MongoDB database
  databaseURI:  config.PARSE_SERVER_DATABASE_URI,
  // Absolute path to your Cloud Code
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId:  config.PARSE_SERVER_APPLICATION_ID,
  masterKey:  config.PARSE_SERVER_MASTER_KEY,
  restAPIKey: config.PARSE_SERVER_REST_API_KEY,
  javascriptKey: config.PARSE_SERVER_JS_KEY,
  // Don't forget to change to https if needed
  serverURL:  config.PARSE_SERVER_URL
});

// Parse Dashboard settings
var dashboardConfig = {
	"allowInsecureHTTP": true,
	"apps": [
    {
      "serverURL": config.PARSE_SERVER_URL,
      "appId": config.PARSE_SERVER_APPLICATION_ID,
      "masterKey": config.PARSE_SERVER_MASTER_KEY,
      "appName": "Motivetica Dashboard"
    }
  ],
  "users": [
    {
      "user":config.PARSE_SERVER_ADMIN,
      "pass":config.PARSE_SERVER_ADMIN_PASSWORD
    }
  ]
};

var dashboard = new ParseDashboard(dashboardConfig, dashboardConfig.allowInsecureHTTP);

// make the Parse Server available at /parse
app.use('/parse', api);

// make the Parse Dashboard available at /dashboard
app.use('/dashboard', dashboard);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('Motivetica : I dream of being a website!');
});

var port = process.env.PORT || 4040;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse server running on port ' + port + '.');
    console.log('Visit dashboard: 'config.PARSE_SERVER_URL' + '/dashboard'');
});
