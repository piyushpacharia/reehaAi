import mongoose from "mongoose";

// Updated schema with GeoJSON format for location
const stationContactSchema = new mongoose.Schema(
  {
    name: { type: String, default: null },
    telephone: { type: Number, default: null },
    phone: { type: Number, default: null },
    location: {
      type: { type: String, enum: ['Point'], required: true, default: 'Point' },
      coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
    stationZone: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

// Create a 2dsphere index for the location field to support geospatial queries
stationContactSchema.index({ location: '2dsphere' });

export const stationContactModel = mongoose.model("stationContacts", stationContactSchema);
