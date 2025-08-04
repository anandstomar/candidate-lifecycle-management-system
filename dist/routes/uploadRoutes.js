"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uploadMiddlewareR_1 = require("../middleware/uploadMiddlewareR");
const uploadController_1 = require("../controllers/uploadController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post('/:id/upload', authMiddleware_1.authenticateUser, uploadMiddlewareR_1.uploadFiles, uploadController_1.uploadResumeAssets);
exports.default = router;
