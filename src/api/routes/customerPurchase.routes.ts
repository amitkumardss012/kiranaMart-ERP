import { FastifyInstance } from "fastify";
import { CustomerPurchaseController } from "../controllers";

const CustomerPurchaseRoute = async (app: FastifyInstance) => {
    app.post("/create", CustomerPurchaseController.OrderProduct)
    app.get("/all", CustomerPurchaseController.getAllCustomerPurchases)
    app.get("/purchase/:customerId", CustomerPurchaseController.GetCustomerPurchases)
    app.get("/:id", CustomerPurchaseController.getCustomerPurchaseById)
    app.delete("/:id", CustomerPurchaseController.deleteCustomerPurchase)
}

export default CustomerPurchaseRoute;