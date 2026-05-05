import { Router } from "express";
import {
  analyzeCareer,
  getCareerPlans,
  getRoles
} from "../controllers/career.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/roles", protect, getRoles);
router.post("/analyze", protect, analyzeCareer);
router.get("/plans", protect, getCareerPlans);

export default router;
