import { FastifyInstance } from "fastify";
import adminRoute from "./admin.routes";
import storeRoute from "./store.routes";
import emplyeeRoleRoute from "./employeeRole.routes";
import employeeRoute from "./employee.routes";

const index = (app: FastifyInstance) => {
    app.register(adminRoute, { prefix: "/admin" });
    app.register(storeRoute, { prefix: "/store" });
    app.register(emplyeeRoleRoute, { prefix: "/employee-role" });
    app.register(employeeRoute, { prefix: "/employee" })
}

export default index