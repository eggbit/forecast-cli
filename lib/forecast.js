
/*
 API Docs: https://developer.darkskyapp.com/docs/v2
 */
var Client, addColorToSummary, client, colors, defaults, displayDaily, displayHourly, formatTemperature, geocoder, header, hourlyDayHeading, moment, signoff;

geocoder = require('geocoder');

colors = require('colors');

moment = require('moment');

Client = require('request-json').JsonClient;

client = new Client('https://api.forecast.io/forecast/f5951365c265a47ef82e6f1bdd33109e/');

defaults = require('./defaults');

if (typeof String.prototype.rpad !== 'function') {
  String.prototype.rpad = function(padString, length) {
    var str;
    str = this;
    while (str.length < length) {
      str = str + padString;
    }
    return str;
  };
}

addColorToSummary = function(summary) {
  var i, len, parts, rains, ref, ref1, word, words;
  parts = [];
  words = summary.split(' ');
  for (i = 0, len = words.length; i < len; i++) {
    word = words[i];
    if ((ref = word.toLowerCase()) === 'rain' || ref === 'rain,' || ref === 'rain.') {
      rains = word.split(/[\.,]/);
      parts.push(rains[0].blue);
    } else if ((ref1 = word.toLowerCase()) === 'sprinkling' || ref1 === 'sprinkling,' || ref1 === 'sprinkling.') {
      rains = word.split(/[\.,]/);
      parts.push(rains[0].cyan);
    } else {
      parts.push(word);
    }
  }
  return parts.join(' ');
};

formatTemperature = function(temperature) {
  return (String(parseInt(temperature)) + '°').rpad(' ', 3).bold;
};

header = function(formattedAddress) {
  console.log('');
  console.log(('--- ' + formattedAddress + ' ').rpad('-', 80));
  return console.log('');
};

signoff = function() {
  console.log('');
  console.log('Now you are prepared.'.grey);
  return console.log('');
};

hourlyDayHeading = function(day) {
  console.log(day.bold);
  return console.log('');
};

displayHourly = function(hourly) {
  var hour, i, len, ref, time;
  if (hourly) {
    hourlyDayHeading('Today');
    ref = hourly.data;
    for (i = 0, len = ref.length; i < len; i++) {
      hour = ref[i];
      time = new moment(hour.time * 1000);
      if (time.hour() > 7 && time.hour() <= 22) {
        if (time.hour() === 8) {
          if (moment().day() !== time.day()) {
            console.log('');
            console.log('');
            hourlyDayHeading(time.format('dddd'));
          }
        }
        console.log((time.format('ha').rpad(' ', 4).red) + " " + (formatTemperature(hour.temperature)) + " " + (addColorToSummary(hour.summary)) + " ");
      }
    }
    return signoff();
  }
};

displayDaily = function(daily) {
  var date, day, i, len, maxTime, ref;
  if (daily) {
    ref = daily.data;
    for (i = 0, len = ref.length; i < len; i++) {
      day = ref[i];
      date = new moment(day.time * 1000);
      maxTime = new moment(day.temperatureMaxTime * 1000);
      if (moment().dayOfYear() === date.dayOfYear()) {
        console.log("    " + (formatTemperature(day.temperatureMax)) + " " + (addColorToSummary(day.summary)));
        console.log('');
      } else {
        console.log((date.format('ddd').red) + " " + (formatTemperature(day.temperatureMax)) + " " + (addColorToSummary(day.summary)));
      }
    }
    console.log('');
    console.log(daily.summary.bold);
    return signoff();
  }
};

exports.get = function(place, hourly) {
  if (hourly == null) {
    hourly = false;
  }
  return geocoder.geocode(place, function(err, data) {
    var address, location, ref, ref1;
    address = data != null ? (ref = data.results) != null ? ref[0] : void 0 : void 0;
    if (location = address != null ? (ref1 = address.geometry) != null ? ref1.location : void 0 : void 0) {
      return client.get(location.lat + "," + location.lng + "?units=" + (defaults.units()) + "&exclude=minutely,alerts", function(err, res, body) {
        if (err) {
          return console.log(err);
        } else {
          header(address != null ? address.formatted_address : void 0);
          if (hourly) {
            return displayHourly(body != null ? body.hourly : void 0);
          } else {
            return displayDaily(body != null ? body.daily : void 0);
          }
        }
      });
    } else {
      return console.log("I can't find your location. Please forgive me.");
    }
  });
};
