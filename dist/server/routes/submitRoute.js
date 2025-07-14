"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const submitController_1 = require("../controllers/submitController");
const router = (0, express_1.Router)();
router.post("/", submitController_1.submitJob);
exports.default = router;
