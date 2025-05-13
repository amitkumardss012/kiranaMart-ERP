import { FastifyInstance } from "fastify";
import { AdminController } from "../controllers";
import { authenticatAdmin, isSuperAdmin } from "../middleware/auth.middleware";

const adminRoute = async (app: FastifyInstance) => {
  app.post(
    "/create",
    { preHandler: [authenticatAdmin] },
    AdminController.createAdmin
  );
  app.post("/login", AdminController.login);

  app.get(
    "/all",
    { preHandler: authenticatAdmin },
    AdminController.getAllAdmin
  );
  app.get("/logout", { preHandler: authenticatAdmin }, AdminController.logout);

  app.post(
    "/:id",
    { preHandler: [authenticatAdmin] },
    AdminController.update
  );
};

export default adminRoute;
