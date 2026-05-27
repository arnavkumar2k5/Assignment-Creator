"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const assignment_controller_1 = require("../controllers/assignment.controller");
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
router.get('/', assignment_controller_1.listAssignments);
router.post('/', upload.single('file'), assignment_controller_1.createAssignment);
router.get('/:id', assignment_controller_1.getAssignment);
router.post('/:id/regenerate', assignment_controller_1.regenerateAssignment);
exports.default = router;
//# sourceMappingURL=assignment.routes.js.map