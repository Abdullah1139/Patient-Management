import express from "express";
import { registerUser,loginUser,addNewAdmin,getAllDoctor,getUserDetail,adminLogout,patientLogout,addNewDoctor,getDoctorCount} from "../controllers/userController.js";
import {isAdminAuthenticated,isPatientAuthenticated} from '../middlewares/authMiddleware.js'


const router = express.Router();

// User Routes
router.post("/patient/register", registerUser);
router.post("/login", loginUser);
router.post("/admin/addnew",isAdminAuthenticated,addNewAdmin)
router.get("/doctors",getAllDoctor)
router.get("/admin/me",isAdminAuthenticated,getUserDetail)
router.get("/patient/me",isPatientAuthenticated,getUserDetail)
router.get("/admin/logout",isAdminAuthenticated,adminLogout)
router.get("/patient/logout",isPatientAuthenticated,patientLogout)
router.post("/doctor/addnew",isAdminAuthenticated,addNewDoctor)
router.get("/count", isAdminAuthenticated,getDoctorCount);






export default router;  
