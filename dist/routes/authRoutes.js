"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
router.post('/register', authController_1.register);
router.post('/login', authController_1.login);
router.post('/logout', authMiddleware_1.authenticateUser, authController_1.logout);
router.post('/make-payment', authMiddleware_1.authenticateUser, authController_1.makePayment);
router.post('/verify-payment', authMiddleware_1.authenticateUser, authController_1.verifyPayment);
exports.default = router;
