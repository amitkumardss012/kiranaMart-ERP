import { FastifyInstance } from "fastify";
import adminRoute from "./admin.routes";
import categroyRoutes from "./categroy.routes";
import employeeRoute from "./employee.routes";
import emplyeeRoleRoute from "./employeeRole.routes";
import productRoute from "./product.routes";
import storeRoute from "./store.routes";
import subCategoryRoutes from "./subCategroy.routes";
import discountRoute from "./discount.routes";
import CustomerPurchaseRoute from "./customerPurchase.routes";
import CustomerRoute from "./customer.routes";

const index = (app: FastifyInstance) => {
    app.register(adminRoute, { prefix: "/admin" });
    app.register(storeRoute, { prefix: "/store" });
    app.register(emplyeeRoleRoute, { prefix: "/employee-role" });
    app.register(employeeRoute, { prefix: "/employee" })
    app.register(productRoute, { prefix: "/product" })
    app.register(categroyRoutes, { prefix: "/category" })
    app.register(subCategoryRoutes, { prefix: "/sub-category" })
    app.register(discountRoute, { prefix: "/discount" })
    app.register(CustomerRoute, { prefix: "/customer" })
    app.register(CustomerPurchaseRoute, { prefix: "/customer-purchase" })
}

export default index