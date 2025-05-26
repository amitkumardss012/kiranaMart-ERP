import { FastifyInstance } from "fastify";
import { authenticatAdmin } from "../middleware/auth.middleware";
import { ProductController } from "../controllers";

const productRoute = async (app: FastifyInstance) => {
  app.post(
    "/create",
    { preHandler: [authenticatAdmin] },
    ProductController.listProduct
  );

  app.get(
    "/all",
    { preHandler: [authenticatAdmin] },
    ProductController.getAllProducts
  );

  app.get(
    "/barcode/:barcode",
    { preHandler: [authenticatAdmin] },
    ProductController.getProductByBarCode 
  )

  app.get(
    "/:id",
    { preHandler: [authenticatAdmin] },
    ProductController.getProductById
  );

  app.post(
    "/:id",
    { preHandler: [authenticatAdmin] },
    ProductController.updateProduct
  );
}

export default productRoute;