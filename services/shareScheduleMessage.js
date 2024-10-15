import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

// Function to send WhatsApp messages using AiSensy API
export const shareScheduleMessage = async ({phoneNumber, userName, date, leavingTime,returningTime , message }) => {

    const AISENSY_API_KEY = process.env.AISENSY_API_KEY;
    const AISENSY_BASE_URL = process.env.AISENSY_BASE_URL || 'https://backend.aisensy.com/campaign/t1/api/v2';

    if (!AISENSY_API_KEY) {
        console.error("AiSensy API Key is missing");
        return;
    }

    const formattedPhoneNumber = phoneNumber ? phoneNumber.toString() : '';
    const formattedUserName = userName ? userName.toString() : '';

    if (!formattedPhoneNumber || !formattedUserName) {
        console.error("Phone number or username is missing or invalid.");
        return;
    }

    // Prepare the message template parameters according to the campaign requirements
    const templateParams = [
        // Second occurrence of [userName]
        formattedUserName,
        date,
        formattedUserName,
        leavingTime,
        formattedUserName,
        returningTime,                               // [location]
        formattedUserName,
        message                                // [videoUrl]
    ];

    // Request body with template message
    const requestBody = {
        apiKey: AISENSY_API_KEY,
        campaignName: "reehaai_schedule",
        destination: formattedPhoneNumber,
        userName: formattedUserName,
        templateParams: templateParams,
        tags: [],
        attributes: {}
    };

    console.log("Sending request to AiSensy with body:", requestBody);

    try {
        const response = await axios.post(
            `${AISENSY_BASE_URL}`,
            requestBody,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${AISENSY_API_KEY}`,
                },
            }
        );

        console.log("Response from AiSensy:", response.data);
        return response.data;
    } catch (error) {
        console.error(`Failed to send message to ${formattedPhoneNumber}:`, error.response ? error.response.data : error.message);
        // throw error;
    }
};
