import Joi from "joi"
import { scheduleModel } from "../models/schedule.model.js"
import { shareScheduleMessage } from "../services/shareScheduleMessage.js"
import { userModel } from "../models/user.model.js"
import { referenceContactModel } from "../models/referenceContacts.model.js"

export const addSchedule = async (req, res, next) => {
    const inputSanitizer = Joi.object({
        userId: Joi.string().required(),
        date: Joi.date().required(),
        leavingTime: Joi.string().required(),
        returningTime: Joi.string().required(),
        message: Joi.string().required(),
    })
    const { error } = inputSanitizer.validate(req.body)
    if (error) {
        return next(error)
    }
    const { userId, date, leavingTime, returningTime, message } = req.body
    try {
        const schedule = await scheduleModel.create({
            userId: userId,
            date: date,
            leavingTime: leavingTime,
            returningTime: returningTime,
            message: message,
        })
        return res.status(200).json({ success: true, message: "Schedule Added Successfully" })
    } catch (error) {
        console.log(error)
        return res.status(200).json({ success: true, message: "Internal Server Error" })
    }
}
export const updateSchedule = async (req, res, next) => {
    const inputSanitizer = Joi.object({
        scheduleId: Joi.string().required(),
        date: Joi.date().required(),
        leavingTime: Joi.string().required(),
        returningTime: Joi.string().required(),
        message: Joi.string().required(),
    })
    const { error } = inputSanitizer.validate(req.body)
    if (error) {
        return next(error)
    }
    const { scheduleId, date, leavingTime, returningTime, message } = req.body
    try {
        const schedule = await scheduleModel.findOneAndUpdate({ _id: scheduleId }, {
            $set: {
                date: date,
                leavingTime: leavingTime,
                returningTime: returningTime,
                message: message,
            }
        }, {
            new: true
        })
        return res.status(200).json({ success: true, message: "Schedule Updated Successfully" })
    } catch (error) {
        console.log(error)
        return res.status(200).json({ success: true, message: "Internal Server Error" })
    }
}
export const deleteSchedule = async (req, res, next) => {
    const inputSanitizer = Joi.object({
        scheduleId: Joi.string().required(),
    })
    const { error } = inputSanitizer.validate(req.body)
    if (error) {
        return next(error)
    }
    const { scheduleId, date, leavingTime, returningTime, message } = req.body
    try {
        const schedule = await scheduleModel.findOneAndUpdate({ _id: scheduleId }, {
            $set: {
                date: date,
                leavingTime: leavingTime,
                returningTime: returningTime,
                message: message,
            }
        }, {
            new: true
        })
        return res.status(200).json({ success: true, message: "Schedule Deleted Successfully" })
    } catch (error) {
        console.log(error)
        return res.status(200).json({ success: true, message: "Internal Server Error" })
    }
}
export const getAllSchedules = async (req, res, next) => {
    const userId = req.user._id;
    try {
        const schedules = await scheduleModel.find({ userId: userId })
        if (!schedules) {
            return res.status(200).json({ success: false, message: "No Schedules Found" })
        }
        return res.status(200).json({ success: true, schedules })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

//share schedule 
export const shareSchedule = async (req, res, next) => {
    const inputSanitizer = Joi.object({
        userId: Joi.string().required(),
        date: Joi.date().required(),
        leavingTime: Joi.string().required(),
        returningTime: Joi.string().required(),
        message: Joi.string().required(),
    })
    const { error } = inputSanitizer.validate(req.body)
    if (error) {
        return next(error)
    }
    const { userId, date, leavingTime, returningTime, message } = req.body
    try {
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const userReferenceContacts = await referenceContactModel.find({ userId });
        if (!userReferenceContacts.length) {
            return res.status(404).json({ success: false, message: "Kindly Add Reference Contacts first" });
        }
        const schedule = await scheduleModel.create({
            userId: userId,
            date: date,
            leavingTime: leavingTime,
            returningTime: returningTime,
            message: message,
        })
        // Send WhatsApp messages to reference contacts
        // for (const contact of userReferenceContacts) {
        //     await shareScheduleMessage({
        //         phoneNumber: contact.phone,
        //         message: message,
        //         userName: user.name,
        //         date: date,
        //         leavingTime: leavingTime,
        //         returningTime: returningTime,

        //     });
        // }
        return res.status(200).json({ success: true, message: "Schedule Shared Successfully" })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}