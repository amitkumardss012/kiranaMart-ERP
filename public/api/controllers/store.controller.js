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
exports.getAllStores = exports.createStore = void 0;
const services_1 = require("../services");
const types_1 = require("../types/types");
const utils_1 = require("../utils");
const asyncHandler_1 = require("../utils/asyncHandler");
const response_util_1 = require("../utils/response.util");
const validators_1 = require("../validators");
const store_validator_1 = require("../validators/store.validator");
const config_1 = require("../../config");
exports.createStore = (0, asyncHandler_1.asyncHandler)((request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const result = store_validator_1.storeValidator.safeParse(request.body);
    if (!result.success) {
        const formattedError = (0, validators_1.zodError)(result.error);
        return reply.status(types_1.statusCode.Bad_Request).send({
            success: false,
            message: "Validation Error",
            errors: formattedError,
        });
    }
    const data = result.data;
    // Check for duplicate email or contactNumber (example validations)
    const existingStore = yield services_1.StoreService.findByEmailorContact(data.email, data.contactNumber);
    if (existingStore) {
        throw new utils_1.ErrorResponse("Store with given email or contact number already exists", types_1.statusCode.Conflict);
    }
    // Create the store
    const store = yield services_1.StoreService.create(data);
    return (0, response_util_1.SuccessResponse)(reply, "Store created successfully", store, types_1.statusCode.Created);
}));
exports.getAllStores = (0, asyncHandler_1.asyncHandler)((request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(request.query.page) || 1;
    const limit = Number(request.query.limit) || 10;
    const [stores, totalStores] = yield Promise.all([
        services_1.StoreService.getAllStores(page, limit),
        config_1.prisma.store.count(),
    ]);
    if (page > Math.ceil(totalStores / limit) && totalStores > 0) {
        throw new utils_1.ErrorResponse("Page not found", types_1.statusCode.Not_Found);
    }
    if (!stores.length) {
        throw new utils_1.ErrorResponse("No stores found", types_1.statusCode.Not_Found);
    }
    return (0, response_util_1.SuccessResponse)(reply, "Stores fetched successfully", {
        stores,
        currentPage: page,
        totalPages: Math.ceil(totalStores / limit),
        totalStores,
        count: stores.length,
    });
}));
