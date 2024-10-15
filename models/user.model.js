import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        // personal info
        profilePic: { type: String, default: null },
        name: { type: String, default: null },
        email: { type: String, default: null },
        phone: { type: Number, default: null },
        password: { type: String, default: null },
        gender: { type: String, default: null },
        currentLocation: {
            latitude: { type: Number, default: null },
            longitude: { type: Number, default: null },
        },
        address: { type: String, default: null },
        workAddress: { type: String, default: null },
        //account status 
        profileStatus: { type: Boolean, default: false },
        accountStatus: { type: Boolean, default: true },

        fcmToken: { type: String, default: null },
        deviceId: { type: String, default: null },
        packageExpired: { type: Boolean, default: false },
        packageExpiryDate: { type: Date, default: null },
    }, {
    timestamps: true
}
);

export const userModel = mongoose.model("user", userSchema);
