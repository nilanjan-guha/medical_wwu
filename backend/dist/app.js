"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const helmet_1 = __importDefault(require("helmet"));
const hpp_1 = __importDefault(require("hpp"));
const morgan_1 = __importDefault(require("morgan"));
const xss_clean_1 = __importDefault(require("xss-clean"));
const env_1 = require("./config/env");
const error_middleware_1 = require("./middleware/error.middleware");
const routes_1 = require("./routes");
exports.app = (0, express_1.default)();
exports.app.use((0, helmet_1.default)());
exports.app.use((0, cors_1.default)({
    origin: env_1.env.MOBILE_ORIGIN === "*" ? true : env_1.env.MOBILE_ORIGIN,
    credentials: true
}));
exports.app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 150
}));
exports.app.use((0, compression_1.default)());
exports.app.use((0, morgan_1.default)("dev"));
exports.app.use(express_1.default.json({ limit: "1mb" }));
exports.app.use((0, cookie_parser_1.default)());
exports.app.use((0, express_mongo_sanitize_1.default)());
exports.app.use((0, xss_clean_1.default)());
exports.app.use((0, hpp_1.default)());
exports.app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "wwu-backend" });
});
exports.app.use("/api", routes_1.apiRouter);
exports.app.use(error_middleware_1.notFound);
exports.app.use(error_middleware_1.errorHandler);
