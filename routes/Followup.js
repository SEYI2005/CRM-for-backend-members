import express from "express";
import {
  createFollowUp,
  getAllFollowUps,
  getFollowUpById,
  updateFollowUp,
  deleteFollowUp,
} from "../controllers/followupController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getAllFollowUps).post(createFollowUp);
router
  .route("/:id")
  .get(getFollowUpById)
  .patch(updateFollowUp)
  .delete(deleteFollowUp);

export default router;
