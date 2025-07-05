"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const submitApplication_controller_1 = require("./submitApplication.controller");
const router = express_1.default.Router();
router.post('/', submitApplication_controller_1.upload, submitApplication_controller_1.submitApplication);
exports.default = router;
