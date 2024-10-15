import mongoose from "mongoose";

const referenceContactsSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Types.ObjectId, ref: "user" },
        phone: { type: Number, default: null },
    },
    {
        timestamps: true
    }
);

export const referenceContactModel = mongoose.model("referenceContacts", referenceContactsSchema);
