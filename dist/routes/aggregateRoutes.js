"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const aggregateController_1 = require("../controllers/aggregateController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get('/getallusers', authMiddleware_1.authenticateUser, aggregateController_1.getAggregatedDashboards);
router.get('/getallusers/my', authMiddleware_1.authenticateUser, aggregateController_1.getMyAggregatedDashboard);
exports.default = router;
