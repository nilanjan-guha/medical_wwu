"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const schema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(["development", "test", "production"]).default("development"),
    PORT: zod_1.z.coerce.number().default(4000),
    MONGODB_URI: zod_1.z.string().min(1),
    JWT_ACCESS_SECRET: zod_1.z.string().min(16),
    JWT_REFRESH_SECRET: zod_1.z.string().min(16),
    JWT_ACCESS_EXPIRES_IN: zod_1.z.string().default("15m"),
    JWT_REFRESH_EXPIRES_IN: zod_1.z.string().default("30d"),
    OPENAI_API_KEY: zod_1.z.string().optional(),
    OPENAI_MODEL: zod_1.z.string().default("gpt-4.1-mini"),
    MOBILE_ORIGIN: zod_1.z.string().default("*")
});
exports.env = schema.parse(process.env);
