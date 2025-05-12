import { FastifyRequest } from "fastify";
import { StoreService } from "../services";
import { statusCode } from "../types/types";
import { ErrorResponse } from "../utils";
import { asyncHandler } from "../utils/asyncHandler";
import { SuccessResponse } from "../utils/response.util";
import { zodError } from "../validators";
import { storeValidator } from "../validators/store.validator";
import { prisma } from "../../config";

export const createStore = asyncHandler(async (request, reply) => {
  const result = storeValidator.safeParse(request.body);
  if (!result.success) {
    const formattedError = zodError(result.error);
    return reply.status(statusCode.Bad_Request).send({
      success: false,
      message: "Validation Error",
      errors: formattedError,
    });
  }

  const data = result.data;

  // Check for duplicate email or contactNumber (example validations)
  const existingStore = await StoreService.findByEmailorContact(
    data.email,
    data.contactNumber
  );
  if (existingStore) {
    throw new ErrorResponse(
      "Store with given email or contact number already exists",
      statusCode.Conflict
    );
  }

  // Create the store
  const store = await StoreService.create(data);

  return SuccessResponse(
    reply,
    "Store created successfully",
    store,
    statusCode.Created
  );
});

export const getAllStores = asyncHandler(async (request: FastifyRequest<{ Querystring: { page: string; limit: string } }>, reply) => {
  const page = Number(request.query.page) || 1;
  const limit = Number(request.query.limit) || 10;

  const [stores, totalStores] = await Promise.all([
    StoreService.getAllStores(page, limit),
    prisma.store.count(),
  ]);

  if(page > Math.ceil(totalStores / limit) && totalStores > 0) {
    throw new ErrorResponse("Page not found", statusCode.Not_Found);
  }

  if(!stores.length) {
    throw new ErrorResponse("No stores found", statusCode.Not_Found);
  }

  return SuccessResponse(reply, "Stores fetched successfully", {
    stores,
    currentPage: page,
    totalPages: Math.ceil(totalStores / limit),
    totalStores,
    count: stores.length
  });
});
