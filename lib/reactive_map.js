var stringify = function(value) {
  if (value === undefined) {
    return 'undefined';
  }
  return EJSON.stringify(value);
};

var parse = function(serialized) {
  if (serialized === undefined || serialized === 'undefined') {
    return undefined;
  }
  return EJSON.parse(serialized);
};

var changed = function(v) {
  v && v.changed();
};

var ensureKey = function(key) {
  if (!_.has(this._keyDeps, key)) {
    this._keyDeps[key] = new Tracker.Dependency;
    this._hasDeps[key] = new Tracker.Dependency;
  }
};

var setObject = function(object) {
  var self = this;

  _.each(object, function(value, key) {
    self.set(key, value);
  });
};

ReactiveMap = function(dictName) {
  this._size = 0;
  this._values = {};
  this._sizeDeps = new Tracker.Dependency;
  this._allDeps = new Tracker.Dependency;
  this._keyDeps = {};
  this._hasDeps = {};
};

ReactiveMap.prototype.set = function(key, value) {
  if (_.isObject(key) && value === undefined) {
    setObject.call(this, key);
    return;
  }

  serializedValue = stringify(value);

  if (_.has(this._values, key)) {
    if (serializedValue === this._values[key]) {
      return;
    }
  } else {
    this._size++;
    this._sizeDeps.changed();
    changed(this._hasDeps[key]);
  }

  this._values[key] = serializedValue;

  this._allDeps.changed();
  changed(this._keyDeps[key]);
};

ReactiveMap.prototype.get = function(key) {
  ensureKey.call(this, key);
  this._keyDeps[key].depend();

  return parse(this._values[key]);
};

ReactiveMap.prototype.has = function(key) {
  ensureKey.call(this, key);
  this._hasDeps[key].depend();

  return _.has(this._values, key);
};

ReactiveMap.prototype.delete = function(key) {
  if (!_.has(this._values, key)) {
    return;
  }

  delete this._values[key];
  this._size--;

  changed(this._keyDeps[key]);
  changed(this._hasDeps[key]);
  this._sizeDeps.changed();
  this._allDeps.changed();
};

ReactiveMap.prototype.all = function() {
  this._allDeps.depend();

  var allValues = {};

  _.each(this._values, function(value, key) {
    allValues[key] = parse(value);
  });

  return allValues;
};

ReactiveMap.prototype.clear = function() {
  var self = this;

  var oldValues = self._values;
  self._values = {};
  self._size = 0;

  self._sizeDeps.changed();
  self._allDeps.changed();

  _.each(oldValues, function(value, key) {
    changed(self._keyDeps[key]);
    changed(self._hasDeps[key]);
  });
};

// Define getter for the size property.
Object.defineProperty(ReactiveMap.prototype, 'size', {
  get: function() {
    this._sizeDeps.depend();
    return this._size;
  }
});
