Tinytest.add('ReactiveMap', function(test) {
  var map = new ReactiveMap({
    a: 1,
    b: 2,
    c: 3,
    d: 4
  });

  var get;
  Tracker.autorun(function() {
    get = map.get('a');
  });
  var has;
  Tracker.autorun(function() {
    has = map.has('a');
  });
  var entries;
  Tracker.autorun(function() {
    entries = map.entries();
  });
  var keys;
  Tracker.autorun(function() {
    keys = map.keys();
  });
  var values;
  Tracker.autorun(function() {
    values = map.values();
  });
  var size;
  Tracker.autorun(function() {
    size = map.size();
  });

  test.equal(get, 1,
    'Initial: Wrong value from the "get()" method'
  );
  test.isTrue(has,
    'Initial: Wrong value from the "has()" method'
  );
  test.equal(entries, {
    a: 1,
    b: 2,
    c: 3,
    d: 4
  },
    'Initial: Wrong value from the "entries()" method'
  );
  test.equal(keys, ['a', 'b', 'c', 'd'],
    'Initial: Wrong value from the "keys()" method'
  );
  test.equal(values, [1, 2, 3, 4],
    'Initial: Wrong value from the "values()" method'
  );
  test.equal(size, 4,
    'Initial: Wrong value from the "size()" method'
  );

  // Set existing.
  map.set('a', 'a');
  Tracker.flush();
  test.equal(get, 'a',
    'Set existing: Wrong value from the "get()" method'
  );
  test.isTrue(has,
    'Set existing: Wrong value from the "has()" method'
  );
  test.equal(entries, {
    a: 'a',
    b: 2,
    c: 3,
    d: 4
  },
    'Set existing: Wrong value from the "entries()" method'
  );
  test.equal(keys, ['a', 'b', 'c', 'd'],
    'Set existing: Wrong value from the "keys()" method'
  );
  test.equal(values, ['a', 2, 3, 4],
    'Set existing: Wrong value from the "values()" method'
  );
  test.equal(size, 4,
    'Set existing: Wrong value from the "size()" method'
  );

  // Delete.
  map.delete('a');
  Tracker.flush();
  test.isUndefined(get,
    'Delete: Wrong value from the "get()" method'
  );
  test.isFalse(has,
    'Delete: Wrong value from the "has()" method'
  );
  test.equal(entries, {
    b: 2,
    c: 3,
    d: 4
  },
    'Delete: Wrong value from the "entries()" method'
  );
  test.equal(keys, ['b', 'c', 'd'],
    'Delete: Wrong value from the "keys()" method'
  );
  test.equal(values, [2, 3, 4],
    'Delete: Wrong value from the "values()" method'
  );
  test.equal(size, 3,
    'Delete: Wrong value from the "size()" method'
  );

  // Clear.
  map.clear();
  Tracker.flush();
  test.isUndefined(get,
    'Clear: Wrong value from the "get()" method'
  );
  test.isFalse(has,
    'Clear: Wrong value from the "has()" method'
  );
  test.equal(entries, {},
    'Clear: Wrong value from the "entries()" method'
  );
  test.equal(keys, [],
    'Clear: Wrong value from the "keys()" method'
  );
  test.equal(values, [],
    'Clear: Wrong value from the "values()" method'
  );
  test.equal(size, 0,
    'Clear: Wrong value from the "size()" method'
  );

  // Set new.
  map.set('a', 1);
  Tracker.flush();
  test.equal(get, 1,
    'Set new: Wrong value from the "get()" method'
  );
  test.isTrue(has,
    'Set new: Wrong value from the "has()" method'
  );
  test.equal(entries, {
    a: 1
  },
    'Set new: Wrong value from the "entries()" method'
  );
  test.equal(keys, ['a'],
    'Set new: Wrong value from the "keys()" method'
  );
  test.equal(values, [1],
    'Set new: Wrong value from the "values()" method'
  );
  test.equal(size, 1,
    'Set new: Wrong value from the "size()" method'
  );
});
