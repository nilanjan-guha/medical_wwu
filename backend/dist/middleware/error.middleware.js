"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFound = void 0;
const zod_1 = require("zod");
const ApiError_1 = require("../utils/ApiError");
const notFound = (_req, res) => {
    res.status(404).json({ message: "Route not found" });
};
exports.notFound = notFound;
const errorHandler = (err, _req, res, _next) => {
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            message: "Validation failed",
            issues: err.issues
        });
    }
    if (err instanceof ApiError_1.ApiError) {
        return res.status(err.statusCode).json({ message: err.message });
    }
    return res.status(500).json({ message: "Internal server error" });
};
exports.errorHandler = errorHandler;
