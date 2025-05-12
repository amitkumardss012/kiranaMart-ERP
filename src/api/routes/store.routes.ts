import { FastifyInstance } from "fastify";
import { StoreController } from "../controllers";
import { authenticatAdmin, isSuperAdmin } from "../middleware/auth.middleware";

const storeRoute = async (app: FastifyInstance) => {
    app.post("/create", { preHandler: [authenticatAdmin, isSuperAdmin] }, StoreController.createStore);
    app.get("/all", { preHandler: authenticatAdmin }, StoreController.getAllStores);
}

export default storeRoute;