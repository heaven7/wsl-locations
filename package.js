Package.describe({
  name: 'heaven7:wsl-locations',
  version: '0.0.4',
  summary: 'Geo location package',
  git: 'https://github.com/heaven7/wsl-locations.git',
  documentation: 'README.md'
})

const both = ['client','server'],
    packages = [
        'heaven7:wsl-core@0.0.3_1',
        'heaven7:wsl-theme-semantic-ui@0.0.3_4',
        'heaven7:wsl-fulfiller@0.0.3_2',
        'aldeed:geocoder@0.3.8',
        'bevanhunt:leaflet@2.0.0',
        'ecmascript',
        'http',
        'es5-shim'
    ]

Package.onUse(function(api) {
    api.versionsFrom('1.3')
    api.use(packages)
    api.imply(packages)

    api.addFiles([
        'lib/both/locations.js',
        'lib/both/schemas.js'
    ], both)

    api.addFiles([
        'lib/server/publish.js',
        'lib/server/methods.js'
    ], ['server'])

    api.addFiles([
        'lib/client/geocode.js',
        'lib/client/locationInput.html',
        'lib/client/locationInput.js',
        'lib/client/map.html',
        'lib/client/map.js',
        'lib/client/templates.css',
        'lib/client/collection.js',

        'lib/client/lib/leaflet.markercluster/css/MarkerCluster.css',
        'lib/client/lib/leaflet.markercluster/css/MarkerCluster.Default.css'
    ], ['client'])

    api.export(['Locations'], both)
})
