"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.requireAuth = void 0;
const ApiError_1 = require("../utils/ApiError");
const token_1 = require("../utils/token");
const requireAuth = (req, _res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
        throw new ApiError_1.ApiError(401, "Unauthorized");
    }
    const token = header.split(" ")[1];
    req.user = (0, token_1.verifyAccessToken)(token);
    next();
};
exports.requireAuth = requireAuth;
const requireRole = (role) => {
    return (req, _res, next) => {
        if (!req.user || req.user.role !== role) {
            throw new ApiError_1.ApiError(403, "Forbidden");
        }
        next();
    };
};
exports.requireRole = requireRole;
