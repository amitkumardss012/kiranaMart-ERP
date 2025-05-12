"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_1 = __importDefault(require("@fastify/cookie"));
const cors_1 = __importDefault(require("@fastify/cors"));
const fastify_1 = __importDefault(require("fastify"));
const fastify_type_provider_zod_1 = require("fastify-type-provider-zod");
const middleware_1 = require("./api/middleware");
const routes_1 = __importDefault(require("./api/routes"));
const config_1 = require("./config");
// 🚀 Initialize fastify application
const app = (0, fastify_1.default)({
    logger: true,
}).withTypeProvider();
app.setValidatorCompiler(fastify_type_provider_zod_1.validatorCompiler);
app.setSerializerCompiler(fastify_type_provider_zod_1.serializerCompiler);
// 🛡️ Security and utility middlewares
app.register(cookie_1.default, {
    secret: 'my-secret', // for cookies signature
    parseOptions: {},
});
app.register(cors_1.default, {
    origin: '*',
});
// 🩺 Health check endpoint
app.get("/", (request, reply) => {
    reply.send({ hello: "world", port: config_1.ENV.PORT });
});
// 🧭 API routes configuration
app.register(routes_1.default, { prefix: "/api/v1/kiranamart" });
// ⚠️ Global error handling middleware
app.register(middleware_1.errorHandlerPlugin);
// 📤 Export the configured app
exports.default = app;
