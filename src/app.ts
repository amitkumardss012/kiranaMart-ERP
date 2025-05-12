import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import fastify from "fastify";
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import { errorHandlerPlugin } from "./api/middleware";
import index from "./api/routes";
import { ENV } from "./config";


// 🚀 Initialize fastify application
const app = fastify({
  logger: true,
}).withTypeProvider<ZodTypeProvider>();
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// 🛡️ Security and utility middlewares
app.register(cookie, {
  secret: 'my-secret', // for cookies signature
  parseOptions: {},
});


app.register(cors, {
  origin: '*',
});

// 🩺 Health check endpoint
app.get("/", (request, reply) => {
  reply.send({ hello: "world", port: ENV.PORT });
});

// 🧭 API routes configuration
app.register(index, { prefix: "/api/v1/kiranamart" });

// ⚠️ Global error handling middleware
app.register(errorHandlerPlugin);

// 📤 Export the configured app
export default app;
