import { FastifyInstance } from "fastify";
import { CatSubController } from "../controllers";
import { authenticatAdmin } from "../middleware/auth.middleware";

const cat_subRoutes = async (app: FastifyInstance) => {
    app.post("/create", { preHandler: [authenticatAdmin] }, CatSubController.createCategory)
    app.get("/all",  { preHandler: [authenticatAdmin] }, CatSubController.getAllCategory)
    app.get("/:id", { preHandler: [authenticatAdmin] }, CatSubController.getCategoryById)
    app.post("/:id", { preHandler: [authenticatAdmin] }, CatSubController.updateCategory)
}

export default cat_subRoutes;