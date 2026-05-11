"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moodCheckinSchema = void 0;
const zod_1 = require("zod");
exports.moodCheckinSchema = zod_1.z.object({
    anxiety: zod_1.z.number().min(0).max(10),
    fear: zod_1.z.number().min(0).max(10),
    stress: zod_1.z.number().min(0).max(10),
    depression: zod_1.z.number().min(0).max(10),
    sleepQuality: zod_1.z.number().min(0).max(10),
    motivation: zod_1.z.number().min(0).max(10),
    painLevel: zod_1.z.number().min(0).max(10),
    freeText: zod_1.z.string().default("")
});
