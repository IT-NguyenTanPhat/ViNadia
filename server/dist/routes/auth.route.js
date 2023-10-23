"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const controllers_1 = require("../controllers");
const auth_validator_1 = require("../validators/auth.validator");
const router = (0, express_1.Router)();
// PATH: /auth
router.post('/login', auth_validator_1.loginValidator, middlewares_1.errorHandler, controllers_1.AuthController.login);
router.get('/google', controllers_1.AuthController.google);
router.post('/register', middlewares_1.upload.single('avatar'), auth_validator_1.registerValidator, middlewares_1.errorHandler, controllers_1.AuthController.register);
router.post('/refresh-token', auth_validator_1.refreshTokenValidator, middlewares_1.errorHandler, controllers_1.AuthController.refreshToken);
exports.default = router;
