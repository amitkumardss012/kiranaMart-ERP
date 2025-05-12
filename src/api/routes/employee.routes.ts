import { FastifyInstance } from "fastify";
import { EmployeeController } from "../controllers";
import { authenticatAdmin, isSuperAdmin } from "../middleware/auth.middleware";

const employeeRoute = async (app: FastifyInstance) => {
  app.post(
    "/create",
    { preHandler: [authenticatAdmin, isSuperAdmin] },
    EmployeeController.Create
  );
  app.get("/all", { preHandler: authenticatAdmin }, EmployeeController.GetAll);
  app.get("/:id", { preHandler: authenticatAdmin }, EmployeeController.GetById);
};

export default employeeRoute;
