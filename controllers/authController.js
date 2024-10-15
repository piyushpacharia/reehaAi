import Joi from "joi";
import { userModel } from "../models/user.model.js";
import JWTService from "../services/JWTService.js";
import bcrypt from 'bcrypt'
import { referenceContactModel } from "../models/referenceContacts.model.js";
import { otpModel } from "../models/otp.model.js";

export const signUp = async (req, res, next) => {
    console.log(req.body)
    const inputSanitizer = Joi.object({
        name: Joi.string().max(30).min(4).required(),
        phone: Joi.number().required(),
        password: Joi.string().required().min(8)
            .regex(/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])/)
            .message('Password must contain at least one uppercase letter, one special character, and one number'),
        email: Joi.string().email().required(),
    });
    const { error } = inputSanitizer.validate(req.body)
    if (error) {
        return next(error)
    }
    const { name, phone, email, password } = req.body;

    try {
        if (!/^[6-9][0-9]{9}$/.test(phone)) {
            return res.json({ success: false, message: 'Invalid phone number' });
        }
        const hashPassword = bcrypt.hashSync(password, 10);
        const user = await userModel.findOne({ email: email })
        if (user) {
            return res.status(409).json({ status: false, message: "Email Already Exists" })
        }
        // const randomeCode = (crypto.randomBytes(4).toString('hex'));
        const newUser = await userModel.create({
            name: name,
            email: email,
            phone: phone,
            password: hashPassword,
        });
        return res.status(200).json({ success: true, message: "Registraion Successfull" })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }

}
export const signIn = async (req, res, next) => {

    const inputSanitizer = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });

    const { error } = inputSanitizer.validate(req.body);
    if (error) {
        return next(error);
    }

    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ success: false, message: "Email not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = JWTService.sign({
                _id: user._id,
            });

            return res.status(200).json({
                success: true,
                message: "LoggedIn Successfully",
                token,
                _id: user._id,
            });
        } else {
            return res.status(401).json({ success: false, message: "Incorrect Password" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
export const forgetPassword = async (req, res, next) => {
    const inputSanitizer = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),

    });
    const { error } = inputSanitizer.validate(req.body)
    if (error) {
        return next(error)
    }
    const { email, password } = req.body;
    try {
        const hashPassword = bcrypt.hashSync(password, 10);
        const user = await userModel.findOneAndUpdate({ email: email }, {
            password: hashPassword
        })
        return res.status(200).json({
            success: true,
            message: "Password Updated Successfully",
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: true, message: "Internal Server Error" })
    }
}
export const updateProfile = async (req, res, next) => {

    const inputSanitizer = Joi.object({
        userId: Joi.string().required(),
        name: Joi.string().max(30).min(4).allow(""),
        email: Joi.string().email().allow(""),
        phone: Joi.number().allow(),
        gender: Joi.string().allow(""),
        address: Joi.string().allow(""),
        workAddress: Joi.string().allow(""),

    });

    const { error } = inputSanitizer.validate(req.body);
    if (error) {
        return next(error);
    }

    const { userId, name, email, phone, gender, address, workAddress } = req.body;

    try {
        const files = req.files;
        console.log(files)
        let profilePicFilename = null;

        if (files && files.profilePic && files.profilePic.length > 0) {
            profilePicFilename = files.profilePic[0].filename;
        } else {
            const userData = await userModel.findOne({ _id: userId })
            profilePicFilename = userData.profilePic ? userData.profilePic : ""
        }
        const token = JWTService.sign(
            {
                _id: userId
            },
        );
        await userModel.findOneAndUpdate(
            { _id: userId },
            {
                profilePic: profilePicFilename,
                name: name,
                email: email,
                gender: gender,
                profileStatus: true,
                phone: phone,
                address: address,
                workAddress: workAddress,

            }
        );

        return res.status(200).json({ success: true, message: "Profile Updated Successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
export const getProfile = async (req, res, next) => {
    const inputSanitizer = Joi.object({
        userId: Joi.string().required()
    })
    const { error } = inputSanitizer.validate(req.body)
    if (error) {
        return next(error)
    }
    const { userId } = req.body;
    try {
        const profile = await userModel.findOne({ _id: userId })
        return res.status(200).json({ success: true, profile })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}
export const logout = async (req, res) => {

    try {
        const token = req.headers.authorization.split(" ")[1];

        JWTService.invalidate(token);

        return res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
export const deleteAccount = async (req, res, next) => {
    const inputSanitizer = Joi.object({
        userId: Joi.string().required()
    })
    const { error } = inputSanitizer.validate(req.body)
    if (error) {
        return next(error)
    }
    const { userId } = req.body;
    try {
        const deleteUser = await userModel.findByIdAndUpdate({ _id: userId }, { accountStatus: false })
        return res.status(200).json({ success: true, message: "Account Deactivated Successfully" })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}
export const addReferenceContact = async (req, res, next) => {
    const inputSanitizer = Joi.object({
        userId: Joi.string().required(),
        phone: Joi.number().required()
    })
    const { error } = inputSanitizer.validate(req.body)
    if (error) {
        return next(error)
    }
    const { userId, phone } = req.body;
    try {
        if (!/^[6-9][0-9]{9}$/.test(phone)) {
            return res.json({ success: false, message: 'Invalid phone number' });
        }
        const isPhoneAlreadyExists = await referenceContactModel.findOne({ userId: userId, phone: phone })
        if (isPhoneAlreadyExists) {
            return res.status(409).json({ success: false, message: "Phone Number Already Exists" })
        }
        const referenceContact = await referenceContactModel.create({ userId: userId, phone: phone })
        return res.status(200).json({ success: true, message: "Contact Added Successfully" })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}
export const getReferenceContacts = async (req, res, next) => {
    const userId = req.user._id;
    try {
        const referenceContacts = await referenceContactModel.find({ userId: userId })
        return res.status(200).json({ success: true, referenceContacts })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}
export const deleteReferenceContacts = async (req, res, next) => {
    const inputSanitizer = Joi.object({
        contactId: Joi.string().required()
    })
    const { error } = inputSanitizer.validate(req.body)
    if (error) {
        return next(error)
    }
    const { contactId } = req.body;
    try {
        const deleteContact = await referenceContactModel.findByIdAndDelete({ _id: contactId })
        return res.status(200).json({ success: true, message: "Contact Deleted Successfully" })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

//address
export const updateAddress = async (req, res, next) => {
    const inputSanitizer = Joi.object({
        userId: Joi.string().required(),
        address: Joi.string().required(),
        workAddress: Joi.string().required(),

    });

    const { error } = inputSanitizer.validate(req.body);
    if (error) {
        return next(error);
    }

    const { userId, address, workAddress } = req.body;

    try {   
        await userModel.findOneAndUpdate(
            { _id: userId },
            {
                address: address,
                workAddress: workAddress,

            }
        );

        return res.status(200).json({ success: true, message: "Address Updated Successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

