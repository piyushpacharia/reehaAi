import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
    { 
        phone: { type: Number, default: null },
        otp: { type: Number, default: null },
    },
    {
        timestamps: true
    }
);

export const otpModel = mongoose.model("otp", otpSchema);
