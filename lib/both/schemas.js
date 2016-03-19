/**
 * Locations schema
 * @type {SimpleSchema} Schemas.Locations
 */

Schemas.Locations = new SimpleSchema([Schemas.Base, {

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
    type: [Number],
    optional: true,
    decimal: true
  },

  lat: {
    type: Number,
    optional: true,
    decimal: true
  },

  lng: {
    type: Number,
    optional: true,
    decimal: true
  }
}])

/**
 * Attach schemas
 */

Locations.attachSchema(Schemas.Locations)
