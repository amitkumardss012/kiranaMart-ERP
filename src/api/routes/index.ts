import { FastifyInstance } from "fastify";
import adminRoute from "./admin.routes";
import storeRoute from "./store.routes";
import emplyeeRoleRoute from "./employeeRole.routes";

const index = (app: FastifyInstance) => {
    app.register(adminRoute, { prefix: "/admin" });
    app.register(storeRoute, { prefix: "/store" });
    app.register(emplyeeRoleRoute, { prefix: "/employee-role" });
}

export default index