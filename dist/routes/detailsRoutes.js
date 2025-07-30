"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const detailsController_1 = require("../controllers/detailsController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const uploadFile_1 = require("../middleware/uploadFile");
const router = (0, express_1.Router)();
router.get('/getmyprofileId', authMiddleware_1.authenticateUser, detailsController_1.getMyCandidate);
router.get('/user-id', authMiddleware_1.authenticateUser, detailsController_1.getCandidateUserId);
router.post('/', authMiddleware_1.authenticateUser, uploadFile_1.upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'resume', maxCount: 1 }
]), detailsController_1.createCandidate);
router.get('/', authMiddleware_1.authenticateUser, detailsController_1.getCandidates);
router.get('/:id', authMiddleware_1.authenticateUser, detailsController_1.getCandidateById);
router.put('/:id', authMiddleware_1.authenticateUser, uploadFile_1.upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'resume', maxCount: 1 }
]), detailsController_1.updateCandidate);
router.delete('/:id', authMiddleware_1.authenticateUser, detailsController_1.deleteCandidate);
exports.default = router;
