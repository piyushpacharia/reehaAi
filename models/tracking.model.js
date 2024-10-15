import mongoose from "mongoose";

const trackingSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Types.ObjectId, ref: "user" },
        leavingHome: {
            time: { type: Date, default: null },
        },
        reachedHome: {
            time: { type: Date, default: null },
        },
        isReachedSafely: { type: Boolean, default: true },
        descripion: { type: String, default: null },
    },
    {
        timestamps: true
    }
);

export const trackingModel = mongoose.model("trackingSchedule", trackingSchema);
