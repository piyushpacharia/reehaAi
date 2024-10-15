import mongoose from "mongoose";

const helpSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Types.ObjectId, ref: "user" },
        requestFrom: {
            time: { type: Date, default: null },
            latitude: { type: String, default: null },
            longitude: { type: String, default: null },
        },
        nearbyStation: {
            time: { type: Date, default: null },
            latitude: { type: String, default: null },
            longitude: { type: String, default: null },
        },
        video: { type: String, default: null },
        audioFile: { type: String, default: null },
    },
    {
        timestamps: true
    }
);

export const helpModel = mongoose.model("help", helpSchema);
