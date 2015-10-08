var changed = function(v) {
  v && v.changed();
};

ReactiveMap = function(data) {
  this._values = {};
  this._size = 0;

  // Tracking the "size" method.
  this._sizeDep = new Tracker.Dependency;
  // Tracking "entries" and "all" methods.
  this._entriesDep = new Tracker.Dependency;
  // Tracking the "key" method.
  this._keysDep = new Tracker.Dependency;
  // Tracking the "values" method.
  this._valuesDep = new Tracker.Dependency;
  // Tracking key existence.
  this._keysDeps = {};
  // Tracking values under keys.
  this._valuesDeps = {};

  // Initialize a map.
  if (data) {
    this.set(data);
  }
};

_.extend(ReactiveMap.prototype, {
  _ensureKey: function(key) {
    if (!_.has(this._valuesDeps, key)) {
      this._keysDeps[key] = new Tracker.Dependency;
      this._valuesDeps[key] = new Tracker.Dependency;
    }
  },

  // Getters.

  get: function(key) {
    this._ensureKey(key);
    this._valuesDeps[key].depend();

    return this._values[key];
  },

  has: function(key) {
    this._ensureKey(key);
    this._keysDeps[key].depend();

    return _.has(this._values, key);
  },

  entries: function() {
    this._entriesDep.depend();

    return _.map(this._values, function(value, key) {
      return [key, value];
    });
  },

  all: function() {
    this._entriesDep.depend();

    var all = {};
    _.each(this._values, function(value, key) {
      all[key] = value;
    });

    return all;
  },

  keys: function() {
    this._keysDep.depend();

    var keys = [];
    _.each(this._values, function(value, key) {
      keys.push(key);
    });

    return keys;
  },

  values: function() {
    this._valuesDep.depend();

    var values = [];
    _.each(this._values, function(value, key) {
      values.push(value);
    });

    return values;
  },

  size: function() {
    this._sizeDep.depend();

    return this._size;
  },

  // Modifiers.

  _setOne: function(key, value) {
    if (_.has(this._values, key)) {
      if (value === this._values[key]) {
        return;
      }
      this._values[key] = value;
    } else {
      this._size++;
      this._values[key] = value;

      this._sizeDep.changed();
      this._keysDep.changed();
      changed(this._keysDeps[key]);
    }

    this._valuesDep.changed();
    this._entriesDep.changed();
    changed(this._valuesDeps[key]);
  },

  _setMany: function(values) {
    var self = this;

    _.each(values, function(value, key) {
      self._setOne(key, value);
    });
  },

  set: function() {
    if (arguments.length === 1 && _.isObject(arguments[0])) {
      return this._setMany.apply(this, arguments);
    } else if (arguments.length === 2) {
      return this._setOne.apply(this, arguments);
    }
  },

  delete: function(key) {
    if (!_.has(this._values, key)) {
      return;
    }

    delete this._values[key];
    this._size--;

    changed(this._valuesDeps[key]);
    changed(this._keysDeps[key]);
    this._sizeDep.changed();
    this._entriesDep.changed();
    this._keysDep.changed();
    this._valuesDep.changed();
  },

  clear: function() {
    var self = this;

    var oldValues = this._values;
    this._values = {};
    this._size = 0;

    this._sizeDep.changed();
    this._entriesDep.changed();
    this._keysDep.changed();
    this._valuesDep.changed();

    _.each(oldValues, function(value, key) {
      changed(self._valuesDeps[key]);
      changed(self._keysDeps[key]);
    });
  }
});
