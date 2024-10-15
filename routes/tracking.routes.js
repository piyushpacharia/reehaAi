import express from 'express'
import authorization from '../middlewares/auth.js';
import { getTimer, getTrackingRecords, inDanger, leavingFromHome, reachedHome } from '../controllers/trackingController.js';
import { uploadFile } from '../middlewares/fileUploader.js';
const router = express.Router()

router.post("/leaving-from-home", authorization, leavingFromHome);
router.post('/reached-home', authorization, reachedHome)
router.get('/get-tracking-records', authorization, getTrackingRecords)
router.post('/user-in-danger/:fileCategory', authorization, uploadFile, inDanger)
// router.get('/get-timer', authorization, getTimer)


export default router;