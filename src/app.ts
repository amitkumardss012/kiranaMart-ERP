import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import multipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import fastify from "fastify";
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import fs from "fs";
import path from "path";
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

app.register(multipart,{limits: {fileSize: 2 * 1024 * 1024}});
app.register(fastifyStatic, {
  root: path.join(process.cwd(), "upload"),
  prefix: "/upload/",
  cacheControl: true,
  // maxAge: "7d", // Cache for 7 days
});

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../upload/category");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

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
