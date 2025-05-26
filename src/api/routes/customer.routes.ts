import { FastifyInstance } from "fastify";
import { CustomerController } from "../controllers";

const CustomerRoute = async (app: FastifyInstance) => {
    app.post("/create", CustomerController.createCustomer);
    app.get("/all", CustomerController.getAllCustomer);
    app.get("/:id", CustomerController.getCustomerById);
    app.post("/:id", CustomerController.updateCustomer);
}

export default CustomerRoute;