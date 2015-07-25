var fs, readDefaults, settingsFile;

fs = require('fs');

settingsFile = "";

if (process.platform === 'win32') {
  settingsFile = process.env['USERPROFILE'] + '/forecast-cli.json';
} else {
  settingsFile = process.env['HOME'] + '/.forecast-cli.json';
}

readDefaults = function() {
  var contents, e;
  contents = '';
  try {
    contents = fs.readFileSync(settingsFile, 'utf8');
  } catch (_error) {
    e = _error;
  }
  try {
    return JSON.parse(contents);
  } catch (_error) {
    e = _error;
    return {};
  }
};

exports.place = function() {
  var ref, ref1;
  return (ref = (ref1 = readDefaults()) != null ? ref1.place : void 0) != null ? ref : '';
};

exports.units = function() {
  var ref, ref1;
  return (ref = (ref1 = readDefaults()) != null ? ref1.units : void 0) != null ? ref : 'si';
};

exports.savePlace = function(place) {
  var defaults;
  defaults = readDefaults();
  defaults.place = place;
  return fs.writeFileSync(settingsFile, JSON.stringify(defaults, null, 2));
};

exports.saveUnits = function(units) {
  var defaults;
  defaults = readDefaults();
  defaults.units = units;
  return fs.writeFileSync(settingsFile, JSON.stringify(defaults, null, 2));
};
