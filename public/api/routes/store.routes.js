"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const controllers_1 = require("../controllers");
const auth_middleware_1 = require("../middleware/auth.middleware");
const storeRoute = (app) => __awaiter(void 0, void 0, void 0, function* () {
    app.post("/create", { preHandler: [auth_middleware_1.authenticatAdmin] }, controllers_1.StoreController.createStore);
    app.get("/all", { preHandler: auth_middleware_1.authenticatAdmin }, controllers_1.StoreController.getAllStores);
});
exports.default = storeRoute;
