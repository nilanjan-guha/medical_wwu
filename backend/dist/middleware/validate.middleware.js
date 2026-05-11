"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = void 0;
const validateBody = (schema) => {
    return (req, _res, next) => {
        req.body = schema.parse(req.body);
        next();
    };
};
exports.validateBody = validateBody;
