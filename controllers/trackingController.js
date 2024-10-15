import Joi from "joi"
import { trackingModel } from "../models/tracking.model.js"
import { helpModel } from "../models/help.model.js"
import { userModel } from "../models/user.model.js"
import { referenceContactModel } from "../models/referenceContacts.model.js"
import { sharingHistoryModel } from "../models/sharingHistory.model.js"
import { sendWhatsAppMessage } from "../services/sendWhatsAppMessage.js"
import { stationContactModel } from "../models/stationContacts.model.js"

export const leavingFromHome = async (req, res, next) => {
    const inputSanitizer = Joi.object({
        userId: Joi.string().required(),
    });

    const { error } = inputSanitizer.validate(req.body);
    if (error) {
        return next(error);
    }

    const { userId } = req.body;
    try {
        const currentDateTime = new Date();
        // Adjust the time to IST (UTC + 5 hours 30 minutes)
        const istDateTime = new Date(currentDateTime.getTime() + (5.5 * 60 * 60 * 1000));
        const checkLeavingHome = await trackingModel.findOne({ userId: userId, "reachedHome.time": null })

        if (!checkLeavingHome) {
            const track = await trackingModel.create({
                userId: userId,
                leavingHome: {
                    time: istDateTime, // Store IST time
                },
            });
            return res.status(200).json({ success: true, message: "Schedule Added Successfully" });
        }
        return res.status(200).json({ success: true, leavingTime: checkLeavingHome.leavingHome.time });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
export const getTimer = async (req, res, next) => {
    const userId = req.user._id;
    try {
        const user = await trackingModel.findOne({ userId: userId, "reachedHome.time": null })
        if (!user) {
            return res.status(404).json({ success: false, message: "Press leaving home button first" })
        }
        return res.status(200).json({ success: true, leavingTime: user.leavingHome.time })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Internal Server Error" })

    }
}
export const reachedHome = async (req, res, next) => {
    const inputSanitizer = Joi.object({
        userId: Joi.string().required(),
    });

    const { error } = inputSanitizer.validate(req.body);
    if (error) {
        return next(error);
    }

    const { userId } = req.body;
    try {
        const currentDateTime = new Date();
        // Adjust the time to IST (UTC + 5 hours 30 minutes)
        const istDateTime = new Date(currentDateTime.getTime() + (5.5 * 60 * 60 * 1000));

        const track = await trackingModel.findOneAndUpdate(
            { userId: userId },
            {
                $set: {
                    reachedHome: {
                        time: istDateTime, // Store IST time
                    },
                },
            },
            {
                new: true,
                useFindAndModify: false, // Optional: to avoid deprecation warning
            }
        );

        if (!track) {
            return res.status(404).json({ success: false, message: "Tracking record not found" });
        }

        return res.status(200).json({ success: true, message: "Schedule Updated Successfully", data: track });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
export const help = async (req, res, next) => {
    const inputSanitizer = Joi.object({
        userId: Joi.string().required(),
        reachedHome: Joi.object({
            time: Joi.date().required(),
            latitude: Joi.string().required(),
            longitude: Joi.string().required(),
        }),
    })
    const { error } = inputSanitizer.validate(req.body)
    if (error) {
        return next(error)
    }
    const { userId, reachedHome } = req.body
    try {
        const track = await trackingModel.findOneAndUpdate({ userId: userId }, {
            $set: {
                reachedHome: reachedHome,
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

// export const deleteSchedule = async (req, res, next) => {
//     const inputSanitizer = Joi.object({
//         scheduleId: Joi.string().required(),
//     })
//     const { error } = inputSanitizer.validate(req.body)
//     if (error) {
//         return next(error)
//     }
//     const { scheduleId, date, leavingTime, returningTime, message } = req.body
//     try {
//         const schedule = await scheduleModel.findOneAndUpdate({ _id: scheduleId }, {
//             $set: {
//                 date: date,
//                 leavingTime: leavingTime,
//                 returningTime: returningTime,
//                 message: message,
//             }
//         }, {
//             new: true
//         })
//         return res.status(200).json({ success: true, message: "Schedule Updated Successfully" })
//     } catch (error) {
//         console.log(error)
//         return res.status(200).json({ success: true, message: "Internal Server Error" })
//     }
// }
// export const updateSchedule = async (req, res, next) => {
//     const inputSanitizer = Joi.object({
//         scheduleId: Joi.string().required(),
//         date: Joi.date().required(),
//         leavingTime: Joi.date().required(),
//         returningTime: Joi.date().required(),
//         message: Joi.string().required(),
//     })
//     const { error } = inputSanitizer.validate(req.body)
//     if (error) {
//         return next(error)
//     }
//     const { scheduleId, date, leavingTime, returningTime, message } = req.body
//     try {
//         const schedule = await scheduleModel.findOneAndUpdate({ _id: scheduleId }, {
//             $set: {
//                 date: date,
//                 leavingTime: leavingTime,
//                 returningTime: returningTime,
//                 message: message,
//             }
//         }, {
//             new: true
//         })
//         return res.status(200).json({ success: true, message: "Schedule Updated Successfully" })
//     } catch (error) {
//         console.log(error)
//         return res.status(200).json({ success: true, message: "Internal Server Error" })
//     }
// }

export const inDanger = async (req, res, next) => {
    const inputSanitizer = Joi.object({
        userId: Joi.string().required(),
        requestedFrom: Joi.object({
            time: Joi.date().required(),
            latitude: Joi.string().required(),
            longitude: Joi.string().required(),
        }).required(),
    });

    const { error } = inputSanitizer.validate(req.body);
    if (error) {
        return next(error);
    }

    const { userId, requestedFrom } = req.body;

    try {
        const files = req.files || {};
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const userReferenceContacts = await referenceContactModel.find({ userId });
        if (!userReferenceContacts.length) {
            return res.status(404).json({ success: false, message: "No reference contacts found for the user" });
        }

        const lat = parseFloat(requestedFrom.latitude);
        const lng = parseFloat(requestedFrom.longitude);

        console.log("Requested From Data:", requestedFrom);

        const nearbyStation = await stationContactModel.aggregate([
            {
                $geoNear: {
                    near: { type: "Point", coordinates: [lng, lat] }, // Ensure coordinates are in [lng, lat] order
                    distanceField: "distance", // Add a distance field in the output
                    spherical: true,
                    maxDistance: 5000, // Optional: max distance in meters
                },
            },
            { $limit: 1 },
        ]);

        if (!nearbyStation.length) {
            return res.status(404).json({ success: false, message: "No nearby stations found" });
        }

        const stationInfo = nearbyStation[0];

        const video = files.video && files.video.length > 0 ? files.video.map(file => file.filename) : null;
        const videoUrl = video ? `http://192.168.1.7:8001/uploads/video/${video[0]}` : "Camera Access Not Found";

        const baseImage = `https://www.simplilearn.com/ice9/free_resources_article_thumb/what_is_image_Processing.jpg`;

        // Create a help record
        // const track = await helpModel.create({
        //     userId: userId,
        //     video: video ? video[0] : null,
        //     requestedFrom: requestedFrom,
        // });

        // Create a sharing history record
        // await sharingHistoryModel.create({
        //     userId: userId,
        //     receiver: userReferenceContacts.map(item => item.phone),
        //     sender: "reehaAI",
        //     message: `Alert Message from ReehaAI\n${user.name} is in danger and has requested help from the following location: ${requestedFrom.latitude}, ${requestedFrom.longitude}`,
        // });

        const message = `Hi, This is ReehaAi,\n${user.name}'s safety partner. ${user.name} is in danger. If you are nearby this location, please reach for help. We have already informed the nearby police station located at ${stationInfo.name} (${stationInfo.latitude}, ${stationInfo.longitude}).\n${user.name}'s Location - https://www.google.com/maps?q=${requestedFrom.latitude},${requestedFrom.longitude}\n${user.name}'s current surrounding video - ${videoUrl}`;

        // Send WhatsApp messages to reference contacts
        for (const contact of userReferenceContacts) {
            await sendWhatsAppMessage({
                baseImage: baseImage,
                phoneNumber: contact.phone,
                message: message,
                userName: user.name,
                location: `https://www.google.com/maps?q=${requestedFrom.latitude},${requestedFrom.longitude}`,
                videoUrl
            });
        }

        return res.status(200).json({
            success: true,
            message: "Danger Alert Successfully Recorded and Messages Sent",
            nearbyStation: {
                stationName: stationInfo.name,
                distance: stationInfo.distance,
                telephone: stationInfo.telephone,
                phone: stationInfo.phone,
                locationUrl: `https://www.google.com/maps?q=${stationInfo.location.coordinates[1]},${stationInfo.location.coordinates[0]}`

            }
        });

    } catch (error) {
        console.error("Error in inDanger API:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};


export const getTrackingRecords = async (req, res, next) => {
    const userId = req.user._id;
    try {
        const trackingSchedules = await trackingModel.find({ userId: userId })
        if (!trackingSchedules) {
            return res.status(200).json({ success: false, message: "No Schedules Found" })
        }
        return res.status(200).json({ success: true, trackingSchedules })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}