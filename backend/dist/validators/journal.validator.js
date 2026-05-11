"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateJournalSchema = exports.createJournalSchema = void 0;
const zod_1 = require("zod");
exports.createJournalSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    content: zod_1.z.string().min(5),
    tags: zod_1.z.array(zod_1.z.string()).default([])
});
exports.updateJournalSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).optional(),
    content: zod_1.z.string().min(5).optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional()
});
