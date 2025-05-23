import { FastifyInstance } from "fastify";
import { DiscountController } from "../controllers";
import { authenticatAdmin } from "../middleware/auth.middleware";

const discountRoute = async (app: FastifyInstance) => {
    app.post(
        "/create",
        { preHandler: [authenticatAdmin] },
        DiscountController.createDiscount
    );

    app.get(
        "/all",
        { preHandler: authenticatAdmin },
        DiscountController.getAllDiscounts
    );

    app.get(
        "/:id",
        { preHandler: authenticatAdmin },
        DiscountController.getDiscountById
    );

    app.post(
        "/:id",
        { preHandler: [authenticatAdmin] },
        DiscountController.updateDiscount
    );
};

export default discountRoute;