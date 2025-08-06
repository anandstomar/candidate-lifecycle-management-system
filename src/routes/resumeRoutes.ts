import { Router, RequestHandler } from 'express';
import {
    createResume,
    getUserResumes,
    getResumeById,
    updateResume,
    deleteResume,
} from '../controllers/resumeController';
import { authenticateUser } from '../middleware/authMiddleware';
import { uploadFiles } from '../middleware/uploadMiddlewareR';
import { uploadResumeAssets } from '../controllers/uploadController';

const router = Router();

// Cast controllers & middleware to RequestHandler
const authHandler = authenticateUser as RequestHandler;
const createHandler = createResume as RequestHandler;
const listHandler = getUserResumes as RequestHandler;
const getHandler = getResumeById as RequestHandler;
const updateHandler = updateResume as RequestHandler;
const deleteHandler = deleteResume as RequestHandler;

// Protect all routes
router.use(authHandler);

router.post('/', createHandler);
router.get('/', listHandler);
router.get('/:id', getHandler);
router.put('/:id', updateHandler);
router.delete('/:id', deleteHandler);
router.post(
    '/:id/upload',
    authenticateUser,
    (req, res, next) => {
        uploadFiles(req, res, (err: any) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            next();
        });
    },
    uploadResumeAssets
);

export default router;

