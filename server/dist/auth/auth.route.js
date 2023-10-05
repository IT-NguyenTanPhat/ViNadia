"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoute = void 0;
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const auth_controller_1 = require("./auth.controller");
const router = (0, express_1.Router)();
exports.AuthRoute = router;
// PATH: /auth
router.post('/login', auth_controller_1.AuthController.login);
router.post('/refresh-token', auth_controller_1.AuthController.refreshToken);
router.post('/register', middlewares_1.upload.single('avatar'), auth_controller_1.AuthController.register);
