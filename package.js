Package.describe({
  name: 'heaven7:wsl-locations',
  version: '0.0.2',
  summary: 'Geo location package',
  git: 'https://github.com/heaven7/wsl-locations.git',
  documentation: 'README.md'
});

both = ['client','server'];

Package.onUse(function(api) {
    api.versionsFrom('1.2');

    var packages = [
        'heaven7:wsl-core@0.0.3_1',
        'heaven7:wsl-items@0.0.2',
        'aldeed:geocoder@0.3.6'

    //    'cordova:org.apache.cordova.geolocation@0.3.10'
    ];

    api.use(packages);
    api.imply(packages);

    api.addFiles([
        'lib/both/locations.js',
        'lib/both/schemas.js',
        'lib/both/helpers.js'
    ], both);

    api.addFiles([
        'lib/server/publish.js',
        'lib/server/methods.js'
    ], ['server']);

    api.addFiles([
        'lib/client/helper.js',
        'lib/client/templates.html',
        'lib/client/templates.js',
        'lib/client/collection.js',
        'lib/client/hooks.js'
    ], ['client']);

    api.export(['Locations'], both);

    Package.onTest(function(api) {
        api.use('sanjo:jasmine@0.18.0');
        api.use('velocity:console-reporter@0.1.3');
        api.use('velocity:html-reporter@0.8.2')
        api.use('heaven7:wsl-locations');

        api.addFiles('tests/client/example-spec.js', ['client']);
        api.addFiles('tests/server/example-spec.js', ['server']);
    });
});
