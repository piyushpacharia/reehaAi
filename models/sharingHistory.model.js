import mongoose from "mongoose";

const sharingHistorySchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Types.ObjectId, ref: "user" },
        sender: { type: String, default: null, enum: ["you", "reehaAI"] },
        receiver: { type: Array, default: null },
        message: { type: String, default: null }
    },
    {
        timestamps: true
    }
);

export const sharingHistoryModel = mongoose.model("sharingHistory", sharingHistorySchema);
