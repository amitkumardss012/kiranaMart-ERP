import { FastifyInstance } from "fastify";
import { CustomerPurchaseController } from "../controllers";

const CustomerPurchaseRoute = async (app: FastifyInstance) => {
    app.post("/create", CustomerPurchaseController.OrderProduct)
}

export default CustomerPurchaseRoute;