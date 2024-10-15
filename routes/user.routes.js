import express from 'express'
import { addReferenceContact, deleteReferenceContacts, forgetPassword, getProfile, getReferenceContacts, logout, signIn, signUp, updateAddress, updateProfile } from '../controllers/authController.js';
import { uploadFile } from '../middlewares/fileUploader.js';
import authorization from '../middlewares/auth.js';

const router = express.Router()
 
router.post("/signUp", signUp);
router.post('/signIn', signIn)
router.post('/forget-password', forgetPassword)
router.post('/update-profile/:fileCategory', authorization, uploadFile, updateProfile)
router.post('/get-profile', authorization, getProfile)
router.post('/logout', authorization, logout)
router.post('/add-reference-contact', authorization, addReferenceContact)
router.post('/get-reference-contacts', authorization, getReferenceContacts)
router.post('/delete-reference-contact', authorization, deleteReferenceContacts)
router.post('/update-address', authorization, updateAddress)




export default router;