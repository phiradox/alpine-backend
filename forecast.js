forecast = (function () {

  return {

    setCObjValues: function(cachePrototype, data) {

      cachePrototype.lati = data.latitude;

      cachePrototype.long = data.longitude;

      cachePrototype.currentTemp = data.currently.temperature;

      cachePrototype.offset = data.offset;

      cachePrototype.timeRecord = new Date(data.currently.time /*+ 60 * cachePrototype.offset*/);

      cachePrototype.serverTimeRecorded = new Date();

      cachePrototype.sunriseTime = data.daily.data[0].sunriseTime /*+ 60 * cachePrototype.offset*/;

      cachePrototype.sunsetTime = data.daily.data[0].sunsetTime /*+ 60 * cachePrototype.offset*/;

      var sdf = [
        [data.daily.data[0].temperatureMax, data.daily.data[1].temperatureMax, data.daily.data[2].temperatureMax,
        data.daily.data[3].temperatureMax, data.daily.data[4].temperatureMax, data.daily.data[5].temperatureMax],
        [data.daily.data[0].precipProbability, data.daily.data[1].precipProbability, data.daily.data[2].precipProbability,
        data.daily.data[3].precipProbability, data.daily.data[4].precipProbability, data.daily.data[5].precipProbability]
      ];
      cachePrototype.sixDayForecast = sdf;

      cachePrototype.precipProb = data.currently.precipProbability;

      cachePrototype.humidity = Math.floor(data.currently.humidity * 100);

      cachePrototype.currentPrecip = data.currently.icon;

      var shf = [
        [data.hourly.data[0].temperature, data.hourly.data[1].temperature, data.hourly.data[2].temperature,
        data.hourly.data[3].temperature, data.hourly.data[4].temperature, data.hourly.data[5].temperature],
        [data.hourly.data[0].precipProbability, data.hourly.data[1].precipProbability, data.hourly.data[2].precipProbability,
        data.hourly.data[3].precipProbability, data.hourly.data[4].precipProbability, data.hourly.data[5].precipProbability]
      ];
      cachePrototype.sixHourForecast = shf;

      //near the equator
      if (cachePrototype.lati < 30 && cachePrototype.lati > -30) {
        cachePrototype.season = 1; //summer
      //'normal' in northern hemisphere
    } else if (cachePrototype.lati >= 30) {
        switch (cachePrototype.timeRecord.getMonth()) {
          case 0:
            cachePrototype.season = 3;
            break;
          case 1:
            cachePrototype.season = 3;
            break;
          case 2:
            cachePrototype.season = 0;
            break;
          case 3:
            cachePrototype.season = 0;
            break;
          case 4:
            cachePrototype.season = 0;
            break;
          case 5:
            cachePrototype.season = 1;
            break;
          case 6:
            cachePrototype.season = 1;
            break;
          case 7:
            cachePrototype.season = 1;
            break;
          case 8:
            cachePrototype.season = 2;
            break;
          case 9:
            cachePrototype.season = 2;
            break;
          case 10:
            cachePrototype.season = 2;
            break;
          case 11:
            cachePrototype.season = 3;
            break;
          default:
            break;
        }
      //'southern' in southern hemisphere
      } else {
        switch (cachePrototype.timeRecord.getMonth()) {
          case 0:
            cachePrototype.season = 1;
            break;
          case 1:
            cachePrototype.season = 1;
            break;
          case 2:
            cachePrototype.season = 2;
            break;
          case 3:
            cachePrototype.season = 2;
            break;
          case 4:
            cachePrototype.season = 2;
            break;
          case 5:
            cachePrototype.season = 3;
            break;
          case 6:
            cachePrototype.season = 3;
            break;
          case 7:
            cachePrototype.season = 3;
            break;
          case 8:
            cachePrototype.season = 0;
            break;
          case 9:
            cachePrototype.season = 0;
            break;
          case 10:
            cachePrototype.season = 0;
            break;
          case 11:
            cachePrototype.season = 1;
            break;
          default:
            break;
        }

      }

      var dayTime = 1;
      if (cachePrototype.timeRecord.getTime() < cachePrototype.sunriseTime || cachePrototype.timeRecord.getTime() > cachePrototype.sunsetTime) {
        dayTime = 0;
      }

      cachePrototype.day = dayTime;

    }

  }

}());

module.exports = forecast;
