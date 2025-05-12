import { FastifyInstance } from "fastify";
import { AdminController } from "../controllers";
import { authenticatAdmin, isSuperAdmin } from "../middleware/auth.middleware";

const adminRoute = async (app: FastifyInstance) => {
  app.post(
    "/create",
    { preHandler: [authenticatAdmin, isSuperAdmin] },
    AdminController.createAdmin
  );
  app.post("/login", AdminController.login);

  app.get(
    "/all",
    { preHandler: authenticatAdmin },
    AdminController.getAllAdmin
  );
  app.get("/logout", { preHandler: authenticatAdmin }, AdminController.logout);

  app.patch(
    "/:id",
    { preHandler: [authenticatAdmin, isSuperAdmin] },
    AdminController.update
  );
};

export default adminRoute;
