import express from 'express';
import {
  createCampaign,
  getAllCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
} from '../controllers/campaignController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getAllCampaigns).post(createCampaign);
router.route('/:id').get(getCampaignById).patch(updateCampaign).delete(deleteCampaign);

export default router;
