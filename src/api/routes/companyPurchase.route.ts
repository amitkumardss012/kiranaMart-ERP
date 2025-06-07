import { FastifyInstance } from "fastify";
import { CompanyPurchaseController } from "../controllers";

const CompanyPurchaseRoute = async (app: FastifyInstance) => {
    app.post("/create", CompanyPurchaseController.createCompanyPurchase)
    app.get("/all", CompanyPurchaseController.getAllCompanyPurchases)
    app.get("/:id", CompanyPurchaseController.getCompanyPurchaseById)
    app.put("/:id", CompanyPurchaseController.updateCompanyPurchaseById)
    app.delete("/:id", CompanyPurchaseController.deleteCompanyPurchaseById)
}

export default CompanyPurchaseRoute;