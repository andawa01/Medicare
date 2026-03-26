import express from "express";
import upload, { optionalSingle } from "../middlewares/multer.js";

import { createDoctor, deleteDoctor, doctorLogin, getDoctorById, getDoctors, toggleDoctorAvailability, updateDoctor } from "../controllers/doctorController.js";

import doctorAuth from "../middlewares/doctorAuth.js";

const doctorRouter = express.Router();

doctorRouter.get("/", getDoctors);
doctorRouter.post("/login", doctorLogin);

doctorRouter.get("/:id", getDoctorById);
doctorRouter.post("/", optionalSingle("image"), createDoctor);

// after login
doctorRouter.put("/:id", doctorAuth, optionalSingle("image"), updateDoctor);
doctorRouter.post("/:id/toggle-availability", doctorAuth, toggleDoctorAvailability);
doctorRouter.delete("/:id", deleteDoctor)

export default doctorRouter;