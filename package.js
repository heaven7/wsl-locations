Package.describe({
  name: 'heaven7:wsl-locations',
  version: '0.0.1',
  summary: 'Geo location package',
  git: 'https://github.com/heaven7/wsl-locations.git',
  documentation: 'README.md'
});

both = ['client','server'];

Package.onUse(function(api) {
    api.versionsFrom('1.1.0.2');

    var packages = [
        'heaven7:wsl-core@0.0.1'
    //    'cordova:org.apache.cordova.geolocation@0.3.10'
    ];

    api.use(packages);
    api.imply(packages);

    api.addFiles([
        'lib/both/locations.js',
        'lib/both/schemas.js'
    ], both);

    api.addFiles([
        'lib/server/publish.js',
        'lib/server/methods.js'
    ], ['server']);

    api.export(['Locations'], both);
});
