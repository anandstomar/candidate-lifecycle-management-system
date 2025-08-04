"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const resumeController_1 = require("../controllers/resumeController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const uploadMiddlewareR_1 = require("../middleware/uploadMiddlewareR");
const uploadController_1 = require("../controllers/uploadController");
const router = (0, express_1.Router)();
const authHandler = authMiddleware_1.authenticateUser;
const createHandler = resumeController_1.createResume;
const listHandler = resumeController_1.getUserResumes;
const getHandler = resumeController_1.getResumeById;
const updateHandler = resumeController_1.updateResume;
const deleteHandler = resumeController_1.deleteResume;
router.use(authHandler);
router.post('/', createHandler);
router.get('/', listHandler);
router.get('/:id', getHandler);
router.put('/:id', updateHandler);
router.delete('/:id', deleteHandler);
router.post('/:id/upload', authMiddleware_1.authenticateUser, (req, res, next) => {
    (0, uploadMiddlewareR_1.uploadFiles)(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        next();
    });
}, uploadController_1.uploadResumeAssets);
exports.default = router;
