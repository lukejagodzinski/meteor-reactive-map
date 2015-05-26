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
  this._keysDeps = new Tracker.Dependency;
  this._valuesDeps = new Tracker.Dependency;
  this._keyDeps = {};
  this._hasDeps = {};
};

_.extend(ReactiveMap.prototype, {
  set: function(key, value) {
    if (_.isObject(key) && value === undefined) {
      setObject.call(this, key);
      return;
    }

    serializedValue = stringify(value);

    if (_.has(this._values, key)) {
      if (serializedValue === this._values[key]) {
        return;
      }
      this._valuesDeps.changed();
    } else {
      this._size++;
      this._sizeDeps.changed();
      changed(this._hasDeps[key]);
      this._keysDeps.changed();
      this._valuesDeps.changed();
    }

    this._values[key] = serializedValue;

    this._allDeps.changed();
    changed(this._keyDeps[key]);
  },

  get: function(key) {
    ensureKey.call(this, key);
    this._keyDeps[key].depend();

    return parse(this._values[key]);
  },

  has: function(key) {
    ensureKey.call(this, key);
    this._hasDeps[key].depend();

    return _.has(this._values, key);
  },

  delete: function(key) {
    if (!_.has(this._values, key)) {
      return;
    }

    delete this._values[key];
    this._size--;

    changed(this._keyDeps[key]);
    changed(this._hasDeps[key]);
    this._sizeDeps.changed();
    this._allDeps.changed();
    this._keysDeps.changed();
    this._valuesDeps.changed();
  },

  entries: function() {
    this._allDeps.depend();

    var allValues = {};

    _.each(this._values, function(value, key) {
      allValues[key] = parse(value);
    });

    return allValues;
  },

  keys: function() {
    this._keysDeps.depend();

    var keys = [];

    _.each(this._values, function(value, key) {
      keys.push(key);
    });

    return keys;
  },

  values: function() {
    this._valuesDeps.depend();

    var values = [];

    _.each(this._values, function(value, key) {
      values.push(parse(value));
    });

    return values;
  },

  clear: function() {
    var self = this;

    var oldValues = this._values;
    this._values = {};
    this._size = 0;

    this._sizeDeps.changed();
    this._allDeps.changed();
    this._keysDeps.changed();
    this._valuesDeps.changed();

    _.each(oldValues, function(value, key) {
      changed(self._keyDeps[key]);
      changed(self._hasDeps[key]);
    });
  }
});

// Define aliases.
ReactiveMap.prototype.all = ReactiveMap.prototype.entries;

// Define getter for the size property.
Object.defineProperty(ReactiveMap.prototype, 'size', {
  get: function() {
    this._sizeDeps.depend();
    return this._size;
  }
});
