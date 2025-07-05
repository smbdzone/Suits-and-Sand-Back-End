"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/index.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const db_1 = require("./db");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// Import your routes here
const developer_routes_1 = __importDefault(require("./api/developers/developer.routes"));
const job_routes_1 = __importDefault(require("./api/jobs/job.routes"));
const newsletter_routes_1 = __importDefault(require("./api/newsletter/newsletter.routes"));
const property_routes_1 = __importDefault(require("./api/properties/property.routes"));
const article_routes_1 = __importDefault(require("./api/articles/article.routes"));
const enquiry_routes_1 = __importDefault(require("./api/enquiries/enquiry.routes"));
const applications_routes_1 = __importDefault(require("./api/jobApplication/applications.routes"));
const comment_routes_1 = __importDefault(require("./api/comments/comment.routes"));
const notification_routes_1 = __importDefault(require("./api/notifications/notification.routes"));
const auth_routes_1 = __importDefault(require("./api/auth/auth.routes"));
const user_routes_1 = __importDefault(require("./api/users/user.routes"));
const routes_1 = __importDefault(require("./api/analytics/routes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const allowedOrigins = [
    'http://localhost:3000',
    'https://suits-and-sand-front-end.vercel.app',
];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.use(express_1.default.json({ limit: '200mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '200mb' }));
app.use((0, cookie_parser_1.default)());
// Static files
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
// Connect to DB
(0, db_1.connectDB)();
// API Routes
app.use('/api/developers', developer_routes_1.default);
app.use('/api/jobs', job_routes_1.default);
app.use('/api/newsletter', newsletter_routes_1.default);
app.use('/api/properties', property_routes_1.default);
app.use('/api/articles', article_routes_1.default);
app.use('/api/enquiries', enquiry_routes_1.default);
app.use('/api/jobApplication', applications_routes_1.default);
app.use('/api/comments', comment_routes_1.default);
app.use('/api/notifications', notification_routes_1.default);
app.use('/api/auth', auth_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/analytics', routes_1.default);
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
exports.default = app;
