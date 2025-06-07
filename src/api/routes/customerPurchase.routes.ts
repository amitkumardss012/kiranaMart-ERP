import { FastifyInstance } from "fastify";
import { CustomerPurchaseController } from "../controllers";

const CustomerPurchaseRoute = async (app: FastifyInstance) => {
    app.post("/create", CustomerPurchaseController.OrderProduct)
    app.get("/all", CustomerPurchaseController.getAllCustomerPurchases)
    app.get("/:customerId", CustomerPurchaseController.GetCustomerPurchases)
    app.delete("/:id", CustomerPurchaseController.deleteCustomerPurchase)
    app.get("/:id", CustomerPurchaseController.getCustomerPurchaseById)
}

export default CustomerPurchaseRoute;