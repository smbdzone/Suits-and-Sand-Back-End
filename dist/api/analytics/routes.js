"use strict";
// backend/routes/analytics.ts
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
const express_1 = __importDefault(require("express"));
const data_1 = require("@google-analytics/data");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router = express_1.default.Router();
const keyPath = path_1.default.join(__dirname, '..', 'analytics-credentials.json');
const credentials = JSON.parse(fs_1.default.readFileSync(keyPath, 'utf-8'));
const analyticsDataClient = new data_1.BetaAnalyticsDataClient({
    credentials,
});
router.get('/analytics', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const [response] = yield analyticsDataClient.runReport({
            property: 'properties/YOUR_GA4_495390133', // 🔁 Replace with your ID
            dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
            dimensions: [{ name: 'country' }],
            metrics: [{ name: 'activeUsers' }],
        });
        const formatted = ((_a = response.rows) === null || _a === void 0 ? void 0 : _a.map(row => {
            var _a, _b;
            return ({
                name: (_a = row.dimensionValues) === null || _a === void 0 ? void 0 : _a[0].value,
                value: parseFloat(((_b = row.metricValues) === null || _b === void 0 ? void 0 : _b[0].value) || '0'),
            });
        })) || [];
        res.json({ data: formatted });
    }
    catch (error) {
        console.error('GA Error:', error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
}));
exports.default = router;
