var express = require("express");
var app = express();
var latitude = '';
var longitude = '';
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
  serverTimeRecorded: 0,
  sunriseTime: 0,
  sunsetTime: 0,
  fiveDayForecast: 0,
  precipProb: 0,
  humidity: 0,
  init: function(lat, lon, cTemp, tRec, sTRec, riseT, setT, fDF, precProb, hum, that) {
    that.lati = lat;
    that.long = lon;
    that.currentTemp = cTemp;
    that.timeRecorded = tRec;
    that.serverTimeRecorded = sTRec;
    that.sunriseTime = riseT;
    that.sunsetTime = setT;
    that.fiveDayForecast = fDF;
    that.precipProb = precProb;
    that.humidity = hum;
  }
}

app.get('/home', function(req, res) {
  res.end('Hello World!');
});

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
      ((new Date().getTime()) - cache[i].serverTimeRecorded.getTime())/6000 < 1) {
      existingData = true;
      x = cache[i];
    } else if (Math.sqrt((cache[i].lati-latitude)*(cache[i].lati-latitude)-(cache[i].long
      -longitude)*(cache[i].long-longitude)) <= 0.01 &&
    !(((new Date().getTime()) - cache[i].serverTimeRecorded.getTime())/6000 < 1)) {
      console.log(i);
      existingData = true;
      var request = require("request");
      var staticI = i;
      request('https://api.forecast.io/forecast/a9063717f498cf4fe483897860222d19/'+cache[i].lati+','+cache[i].long, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var data = JSON.parse(body);
          x = Object.create(cachePrototype);
          x.init(data.latitude, data.longitude, data.currently.temperature, new Date(data.currently.time*1000), new Date(),
            data.daily.data[0].sunriseTime, data.daily.data[0].sunsetTime, [data.daily.data[0].temperatureMax, data.daily.data[1].temperatureMax,
            data.daily.data[2].temperatureMax, data.daily.data[3].temperatureMax, data.daily.data[4].temperatureMax],
            data.currently.precipProbability, data.currently.humidity, x);
          console.log(i);
          cache.splice(staticI, 1, x);
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
        x.init(data.latitude, data.longitude, data.currently.temperature, new Date(data.currently.time*1000), new Date(),
          data.daily.data[0].sunriseTime, data.daily.data[0].sunsetTime, [data.daily.data[0].temperatureMax, data.daily.data[1].temperatureMax,
          data.daily.data[2].temperatureMax, data.daily.data[3].temperatureMax, data.daily.data[4].temperatureMax],
          data.currently.precipProbability, data.currently.humidity, x);
        cache.push(x);
        res.send(x);
      }
    });
  } else {
    res.send(x);
  }

  latitude = '';
  longitude = '';
})

app.get('/cache', function(req, res) {
  res.send(cache);
});

app.listen(3000);
