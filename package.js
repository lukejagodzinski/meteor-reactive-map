Package.describe({
  summary: 'Reactive map for Meteor',
  version: '0.2.3',
  name: 'jagi:reactive-map',
  git: 'https://github.com/jagi/meteor-reactive-map.git'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');

  api.use('underscore');
  api.use('tracker');
  api.use('ejson');

  api.addFiles('lib/reactive_map.js', ['client', 'server']);

  api.export(['ReactiveMap'], ['client', 'server']);
});
