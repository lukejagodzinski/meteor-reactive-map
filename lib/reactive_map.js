var changed = function(v) {
  v && v.changed();
};

var setObject = function(object) {
  var self = this;

  _.each(object, function(value, key) {
    self.set(key, value);
  });
};

ReactiveMap = function(data) {
  this._map = new Map();
  this._size = 0;
  this._values = {};
  this._sizeDep = new Tracker.Dependency;
  this._allDep = new Tracker.Dependency;
  this._keysDep = new Tracker.Dependency;
  this._valuesDep = new Tracker.Dependency;
  this._keyDeps = {};
  this._hasDeps = {};

  // Initialize a map.
  if (data) {
    this.set(data);
  }
};

_.extend(ReactiveMap.prototype, {
  _ensureKey: function(key) {
    if (!_.has(this._keyDeps, key)) {
      this._keyDeps[key] = new Tracker.Dependency;
      this._hasDeps[key] = new Tracker.Dependency;
    }
  },

  // Getters.

  get: function(key) {
    this._ensureKey(key);
    this._keyDeps[key].depend();

    return this._values[key];
  },

  has: function(key) {
    this._ensureKey(key);
    this._hasDeps[key].depend();

    return _.has(this._values, key);
  },

  entries: function() {
    this._allDep.depend();

    var entries = {};
    _.each(this._values, function(value, key) {
      entries[key] = value;
    });

    return entries;
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

  set: function(key, value) {
    if (_.isObject(key) && value === undefined) {
      setObject.call(this, key);
      return;
    }

    if (_.has(this._values, key)) {
      if (value === this._values[key]) {
        return;
      }
      this._valuesDep.changed();
    } else {
      this._size++;
      this._sizeDep.changed();
      this._keysDep.changed();
      this._valuesDep.changed();
      changed(this._hasDeps[key]);
    }

    this._values[key] = value;

    this._allDep.changed();
    changed(this._keyDeps[key]);
  },

  delete: function(key) {
    if (!_.has(this._values, key)) {
      return;
    }

    delete this._values[key];
    this._size--;

    changed(this._keyDeps[key]);
    changed(this._hasDeps[key]);
    this._sizeDep.changed();
    this._allDep.changed();
    this._keysDep.changed();
    this._valuesDep.changed();
  },

  clear: function() {
    var self = this;

    var oldValues = this._values;
    this._values = {};
    this._size = 0;

    this._sizeDep.changed();
    this._allDep.changed();
    this._keysDep.changed();
    this._valuesDep.changed();

    _.each(oldValues, function(value, key) {
      changed(self._keyDeps[key]);
      changed(self._hasDeps[key]);
    });
  },


});

// Define aliases.
ReactiveMap.prototype.all = ReactiveMap.prototype.entries;
