import express from 'express';
import upload, { optionalSingle } from '../middlewares/multer.js';

import { createService, deleteService, getAllServices, getServiceById, updateService } from '../controllers/ServiceController.js';

const serviceRouter = express.Router();

serviceRouter.get("/", getAllServices);
serviceRouter.get("/:id", getServiceById);

serviceRouter.post("/", optionalSingle("image"), createService);
serviceRouter.put("/:id", optionalSingle("image"), updateService);

serviceRouter.delete("/:id", deleteService);

export default serviceRouter;