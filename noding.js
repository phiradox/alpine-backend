var express = require("express");
var app = express();
var latitude = '';
var longitude = '';
var forecast = require("./forecast.js");
var cache = [];

if (typeof Object.create !== 'function') {
  Object.create = function (o) {
    var F = function() {};
    F.prototype = o;
    return new F();
  };
}

var cachePrototype = {
  lati: 0,
  long: 0,
  currentTemp: 0,
  timeRecorded: 0,
  offset: 0,
  serverTimeRecorded: 0,
  sunriseTime: 0,
  sunsetTime: 0,
  sixDayForecast: [],
  precipProb: 0,
  humidity: 0,
  currentPrecip: 0,
  sixHourForecast: [],
  season: 0,
  day: 0
}

app.param('latitude', function (req, res, next, value) {
  latitude = value;
  next();
})

app.param('longitude', function (req, res, next, value) {
  longitude = value;
  next();
})

app.get('/weather/:latitude/:longitude/requestData', function(req, res) {

  var x;
  var existingData = false;

  for (var i = 0; i < cache.length; i++) {

    if (Math.sqrt((cache[i].lati-latitude)*(cache[i].lati-latitude)+(cache[i].long
      -longitude)*(cache[i].long-longitude)) <= 0.01 &&
      ((new Date().getTime()) - cache[i].serverTimeRecorded.getTime())/900000 < 1) {

      existingData = true;
      x = cache[i];
      res.send(x);

    } else if (Math.sqrt((cache[i].lati-latitude)*(cache[i].lati-latitude)-(cache[i].long
      -longitude)*(cache[i].long-longitude)) <= 0.01 &&
    !(((new Date().getTime()) - cache[i].serverTimeRecorded.getTime())/900000 < 1)) {

      existingData = true;

      var request = require("request");
      var staticI = i;

      request('https://api.forecast.io/forecast/a9063717f498cf4fe483897860222d19/'+cache[i].lati+','+cache[i].long, function (error, response, body) {

        if (!error && response.statusCode == 200) {

          var data = JSON.parse(body);
          x = Object.create(cachePrototype);
          forecast.setCObjValues(x, data);
          cache.splice(staticI, 1, x);
          res.send(x);
        }
      });
    }
  }

  if (!existingData) {

    var request = require("request");

    request('https://api.forecast.io/forecast/a9063717f498cf4fe483897860222d19/'+latitude+','+longitude, function (error, response, body) {

      if (!error && response.statusCode == 200) {
        var data = JSON.parse(body);
        x = Object.create(cachePrototype);
        forecast.setCObjValues(x, data);
        cache.push(x);
        res.send(x);
      }
    });

  }

  latitude = '';
  longitude = '';
})

app.get('/cache', function(req, res) {
  res.send(cache);
});

app.listen(3000);
