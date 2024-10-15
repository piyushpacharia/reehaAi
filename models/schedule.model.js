import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Types.ObjectId, ref: "user" },
        date: { type: Date, default: null },
        leavingTime: { type: Date, default: null },
        returningTime: { type: Date, default: null },
        message: { type: String, default: null },
    },
    {
        timestamps: true
    }
);

export const scheduleModel = mongoose.model("schedule", scheduleSchema);
