import express from 'express'
import authorization from '../middlewares/auth.js';
import { addStation, getAllStations } from '../controllers/stationController.js';

const router = express.Router()

router.post("/add-station", authorization, addStation);
router.get("/get-all-stations", authorization, getAllStations);


export default router;