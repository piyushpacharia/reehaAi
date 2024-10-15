import express from 'express'
import authorization from '../middlewares/auth.js';
import { addSchedule, deleteSchedule, getAllSchedules, shareSchedule, updateSchedule } from '../controllers/scheduleController.js';

const router = express.Router()

router.post("/add-schedule", authorization, addSchedule);
router.post('/update-schedule', authorization, updateSchedule)
router.post('/delete-schedule', authorization, deleteSchedule)
router.get('/get-all-schedules', authorization, getAllSchedules)
router.post('/share-schedule', authorization, shareSchedule)

export default router;