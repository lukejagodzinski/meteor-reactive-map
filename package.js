Package.describe({
  summary: 'Reactive map for Meteor',
  version: '2.0.0',
  name: 'jagi:reactive-map',
  git: 'https://github.com/jagi/meteor-reactive-map.git'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');

  api.use('underscore');
  api.use('tracker');

  api.addFiles('lib/reactive_map.js', ['client', 'server']);

  api.export(['ReactiveMap'], ['client', 'server']);
});

Package.onTest(function(api) {
  api.use([
    'tinytest',
    'tracker',
    'underscore',
    'ejson',
    'jagi:reactive-map'
  ]);

  api.addFiles('test/reactive_map.js', ['client', 'server']);
});
