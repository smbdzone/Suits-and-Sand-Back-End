"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const job_controller_1 = require("./job.controller");
const router = express_1.default.Router();
router.get('/', job_controller_1.getJobs);
router.post('/', job_controller_1.createJob);
router.get('/positions', job_controller_1.getJobTitles);
router.put('/:id', job_controller_1.updateJob);
router.get('/:id', job_controller_1.getJobById);
router.delete('/:id', job_controller_1.deleteJob);
exports.default = router;
