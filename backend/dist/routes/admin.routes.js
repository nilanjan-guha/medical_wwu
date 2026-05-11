"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
exports.adminRouter = (0, express_1.Router)();
exports.adminRouter.use(auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)("admin"));
exports.adminRouter.get("/analytics", admin_controller_1.getAdminAnalytics);
