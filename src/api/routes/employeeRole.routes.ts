import { FastifyInstance } from "fastify";
import { EmployeeRoleController } from "../controllers";
import { authenticatAdmin, isSuperAdmin } from "../middleware/auth.middleware";

const emplyeeRoleRoute = async (app: FastifyInstance) => {
  app.post(
    "/create",
    { preHandler: [authenticatAdmin] },
    EmployeeRoleController.Create
  );
  app.get(
    "/all",
    { preHandler: authenticatAdmin },
    EmployeeRoleController.GetAll
  );
  app.get(
    "/:id",
    { preHandler: authenticatAdmin },
    EmployeeRoleController.GetById
  );


  app.post(
    "/:id",
    { preHandler: [authenticatAdmin] },
    EmployeeRoleController.Update
  );

};

export default emplyeeRoleRoute;
