"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminProfile = exports.logoutAdmin = exports.loginAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const SECRET = process.env.JWT_SECRET;
if (!SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}
// =============================
// LOGIN ADMIN (from DB)
// =============================
const loginAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield user_model_1.default.findOne({ email });
        if (!user || user.status !== 'active') {
            res.status(401).json({ message: 'Invalid credentials or inactive user' });
            return;
        }
        // ✅ Plain text comparison
        if (user.password !== password) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role, email: user.email }, SECRET, { expiresIn: '1h' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });
        res.status(200).json({ success: true, role: user.role });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.loginAdmin = loginAdmin;
// =============================
// LOGOUT ADMIN
// =============================
const logoutAdmin = (_req, res) => {
    res.clearCookie('token', {
        path: '/',
    });
    res.status(200).json({ message: 'Logged out' });
};
exports.logoutAdmin = logoutAdmin;
// =============================
// CHECK AUTH STATUS
// =============================
const getAdminProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, SECRET);
        const user = yield user_model_1.default.findById(decoded.id).select('fullName role email profilePicture');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({ user });
    }
    catch (err) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
});
exports.getAdminProfile = getAdminProfile;
