import notifcation from 'firebase-admin';
import serviceAccount from './' assert { type: 'json' };

// Initialize Firebase notification SDK
notifcation.initializeApp({
    credential: notifcation.credential.cert(serviceAccount),
});

export const sendNotificationService = async (tokens, messageData) => {
    const message = {
        token: tokens,
        notification: {
            title: messageData.title, 
            body: messageData.body,
            image: messageData.image, // Include image URL here
        },
    };

    try {
        const response = await notifcation.messaging().send(message);
        console.log('Successfully sent message:', response);
        return response;
    } catch (error) {
        console.error('Error sending message:', error);
        // throw new Error('Failed to send notifications');
    }
};