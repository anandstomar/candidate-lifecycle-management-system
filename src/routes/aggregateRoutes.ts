import { Router } from 'express';
import { getAggregatedDashboards, getMyAggregatedDashboard } from '../controllers/aggregateController';
import { authenticateUser } from '../middleware/authMiddleware'; // Assuming you have an authentication middleware

const router = Router();

// Route to get all aggregated dashboards (requires authentication)
router.get('/getallusers', authenticateUser, getAggregatedDashboards);

// Route to get the aggregated dashboard for the logged-in user
router.get('/getallusers/my', authenticateUser, getMyAggregatedDashboard);

export default router;