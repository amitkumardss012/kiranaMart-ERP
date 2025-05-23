import { FastifyInstance } from "fastify";
import { authenticatAdmin } from "../middleware/auth.middleware";
import { SubCategoryController } from "../controllers";

const subCategoryRoutes = async (app: FastifyInstance) => {
    app.post("/create", { preHandler: [authenticatAdmin] }, SubCategoryController.createSubCategory);
    app.get("/all", { preHandler: authenticatAdmin }, SubCategoryController.getAllSubCategory);
    app.get("/:id", { preHandler: authenticatAdmin }, SubCategoryController.getSubCategoryById);
    app.post("/:id", { preHandler: authenticatAdmin }, SubCategoryController.updateSubCategory);
};

export default subCategoryRoutes;