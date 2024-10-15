
import Joi from "joi";
import { otpModel } from "../models/otp.model.js";
import { sendOtpWhatsapp } from "../services/sendOtp.js";


const sendSMS = (phone, otp) => {
    console.log(`Sending OTP ${otp} to phone number ${phone}`);
};

const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

export const sendOtp = async (req, res) => { 
    const { phone } = req.body;

    if (!phone) return res.status(400).json({ message: "Phone number is required" });

    try {
        const otp = generateOTP();

        await otpModel.findOneAndUpdate(
            { phone },
            { phone, otp },
            { upsert: true, new: true }
        );

        sendSMS(phone, otp);

        // await sendOtpWhatsapp({
        //     phoneNumber: phone,
        //     otp:JSON.stringify(otp)
        // }); 

        res.status(200).json({ message: "OTP sent successfully", phone, otp });
    } catch (err) {
        res.status(500).json({ message: "Failed to send OTP", error: err.message });
    }
};

export const verifyOtp = async (req, res, next) => {
    const inputSanitizer = Joi.object({
        phone: Joi.number().required(),
        otp: Joi.number().required()
    })
    const { error } = inputSanitizer.validate(req.body)
    if (error) {
        return next(error)
    }
    const { phone, otp } = req.body;
     
    try {
        // Find OTP in the database
        const otpRecord = await otpModel.findOne({ phone });
        // Check if OTP exists and is not expired (5 minutes)
        if (!otpRecord) return res.status(404).json({ message: "OTP not found" });
       

        const now = new Date();
        const otpCreationTime = new Date(otpRecord.createdAt);
        const differenceInMinutes = Math.floor((now - otpCreationTime) / 60000);

        if (differenceInMinutes > 5) {
            console.log("inner...", differenceInMinutes)
            await otpModel.deleteOne({ phone });
            return res.status(400).json({ message: "OTP has expired" });
        }

        if (otpRecord.otp != otp) return res.status(400).json({ message: "Invalid OTP" });
        if (otpRecord.otp != otp) {
            console.log("invalid")
        }
        await otpModel.deleteOne({ phone });

        res.status(200).json({ message: "OTP verified successfully" });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Failed to verify OTP", error: err.message });
    }
};
