/**
 * Locations schema
 * @type {SimpleSchema} Schemas.Locations
 */

Schemas.Locations = new SimpleSchema({

  country: {
      type: String,
      optional: true
  },

  city: {
      type: String,
      optional: true
  },

  state: {
      type: String,
      optional: true
  },

  countryCode: {
      type: String,
      optional: true
  },

  loc: {
    type: [Object],
    optional: true
  },

  "loc.$.lat": {
    type: String,
    optional: true
  },

  "loc.$.lng": {
    type: String,
    optional: true
  }
});

/**
 * Attach schemas
 */

// get schemas from other packages
var merged = Schemas.packages(Schemas.Locations);

// reassign the merged schema
Schemas.Locations = new SimpleSchema(merged);

Schemas.add(Schemas.Locations, Locations);
