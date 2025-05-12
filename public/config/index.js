"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV = exports.prisma = void 0;
const prisma_1 = __importDefault(require("./prisma"));
exports.prisma = prisma_1.default;
const env_1 = __importDefault(require("./env"));
exports.ENV = env_1.default;
