import Joi from "joi";
import { stationContactModel } from "../models/stationContacts.model.js";

export const addStation = async (req, res, next) => {
    // Input validation schema
    const inputSanitizer = Joi.object({
        name: Joi.string().required(),
        location: Joi.object({
            latitude: Joi.string().required(),
            longitude: Joi.string().required(),
        }).required(), // Ensure location is a required field
        phone: Joi.number().allow(null), // Allow null for phone
        telephone: Joi.number().allow(null), // Allow null for telephone
        stationZone: Joi.string().required(),
    });

    const { error } = inputSanitizer.validate(req.body);
    if (error) {
        return next(error);
    }

    const { name, location, phone, telephone, stationZone } = req.body;

    try {
        // Create a new station contact entry in the database
        const newStation = await stationContactModel.create({
            name,
            phone,
            telephone,
            stationZone,
            location: {
                type: 'Point', // GeoJSON type
                coordinates: [
                    parseFloat(location.longitude), // Longitude
                    parseFloat(location.latitude),  // Latitude
                ],
            },
        });

        return res.status(201).json({ success: true, message: "Station Added Successfully", station: newStation });
    } catch (error) {
        console.error("Error in addStation API:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
export const getAllStations = async (req, res) => {
    try {
        const stations = await stationContactModel.find({}, 'location.coordinates'); // Only select the coordinates field
        if (!stations || stations.length === 0) {
            return res.status(404).json({ success: false, message: "No Station Found" });
        }

        // Map each station to an object with latitude and longitude
        const coordinates = stations.map(station => ({
            latitude: station.location.coordinates[1],
            longitude: station.location.coordinates[0]
        }));

        return res.status(200).json({ success: true, coordinates });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

