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
const config_1 = require("../../config");
class StoreService {
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const store = yield config_1.prisma.store.create({
                data
            });
            return store;
        });
    }
    static findByEmailorContact(email, contact) {
        return __awaiter(this, void 0, void 0, function* () {
            const store = yield config_1.prisma.store.findFirst({
                where: {
                    OR: [
                        { email },
                        { contactNumber: contact }
                    ]
                }
            });
            return store;
        });
    }
    static getAllStores() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 10) {
            const stores = yield config_1.prisma.store.findMany({
                take: limit,
                skip: (page - 1) * limit,
                orderBy: {
                    createdAt: "desc"
                }
            });
            return stores;
        });
    }
}
exports.default = StoreService;
