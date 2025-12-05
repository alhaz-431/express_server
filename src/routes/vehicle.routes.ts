import { Router } from "express";
import {
  createVehicle,
  getVehicles,
  updateVehicle,
  deleteVehicle,
} from "../controllers/vehicle.controller";

import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// Only admin can create/update/delete
router.post("/", authenticate, createVehicle);
router.get("/", getVehicles);
router.get("/:id", getVehicles);
router.patch("/:id", authenticate, updateVehicle);
router.delete("/:id", authenticate, deleteVehicle);

export default router;
