import { FastifyRequest } from "fastify";
import { prisma } from "../../config";
import { asyncHandler } from "../utils/asyncHandler";
import { ErrorResponse, SuccessResponse } from "../utils/response.util";
import { baseDiscountSchema, DiscountType, discountValidator } from "../validators/discount.validator";
import { zodError } from "../validators";
import { statusCode } from "../types/types";

export const createDiscount = asyncHandler(
  async (req: FastifyRequest, reply) => {
    const parsed = discountValidator.safeParse(req.body);

    if (!parsed.success) {
      return reply.status(statusCode.Bad_Request).send({
        success: false,
        message: "Validation failed",
        errors: zodError(parsed.error),
      });
    }

    const data = parsed.data;

    // Step 2: Logical validations
    const now = new Date();
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);

    if (start >= end) {
      throw new ErrorResponse(
        "End date must be later than start date.",
        statusCode.Bad_Request
      );
    }

    if (start < now) {
      throw new ErrorResponse(
        "Start date cannot be in the past.",
        statusCode.Bad_Request
      );
    }

    if(data.discountType === "BOGO" && (!data.buyQty || !data.getQty)){
      throw new ErrorResponse(
        "BOGO discount must have buyQty and getQty",
        statusCode.Bad_Request
      );
    }

    if (data.discountType === "BOGO") {
      if(data.value){
        throw new ErrorResponse(
          "BOGO discount cannot have a value",
          statusCode.Bad_Request
        );
      }
    }

      const discount = await prisma.discount.create({
        data
      });

      return SuccessResponse(reply, "Discount created successfully", discount);
  }
);


export const getAllDiscounts = asyncHandler(async (req: FastifyRequest<{Querystring: { page: string;
    limit: string;
    isActive: string;
    discountType: "FLAT" | "PERCENTAGE" | "BOGO";
  searchQuery: string;
}
}>, reply) => {

    
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const isActive =
      req.query.isActive === "true" || req.query.isActive === "false"
        ? req.query.isActive === "true"
        : undefined;
    const discountType = req.query.discountType || "";
  const searchQuery = req.query.searchQuery || "";
  
  if(discountType){
    if(!["FLAT", "PERCENTAGE", "BOGO"].includes(discountType)){
      throw new ErrorResponse("Invalid discount type", statusCode.Bad_Request);
    }
  }

    if (page < 1 || limit < 1) {
        throw new ErrorResponse("Page and limit must be positive integers", statusCode.Bad_Request);
      }
  

      const skip = (page - 1) * limit;

    const where: any = {};
    
    if(searchQuery){
      where.title = {
        contains: searchQuery,
      };
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    // if (["FLAT", "PERCENTAGE", "BOGO"].includes(req.query.discountType || "")) {
    //     where.discountType = req.query.discountType;
    // }

    if (discountType) {
        where.discountType = discountType;
    }
    

    const [discounts, totalDiscounts] = await Promise.all([
      prisma.discount.findMany({
        skip,
        take: limit,
        where,
      }),
      prisma.discount.count({ where }),
    ]);

    return SuccessResponse(reply, "Discounts fetched successfully", {
      discounts,
      currentPage: page,
      totalPages: Math.ceil(totalDiscounts / limit),
      totalDiscounts,
      count: discounts.length,
    });
});


export const getDiscountById = asyncHandler(async (req: FastifyRequest<{Params: {id: string}}>, reply) => {
    const id = Number(req.params.id)

    if (!id || isNaN(id))
        throw new ErrorResponse("Invalid id", statusCode.Bad_Request);
    

    const discount = await prisma.discount.findUnique({ where: { id } })
    
    if (!discount || discount.id !== id)
        throw new ErrorResponse("Discount not found", statusCode.Not_Found);
    
    return SuccessResponse(reply, "Discount fetched successfully", discount)

})


export const updateDiscount = asyncHandler(async (req: FastifyRequest<{Params: {id: string}, Body: Partial<DiscountType>}>, reply) => {
    const id = Number(req.params.id)

    if (!id || isNaN(id))
        throw new ErrorResponse("Invalid id", statusCode.Bad_Request);

    const validData = baseDiscountSchema.partial().safeParse(req.body);
    if (!validData.success) {
      const zodErr = zodError(validData.error);
      return reply.status(statusCode.Bad_Request).send({
        success: false,
        message: "Validation failed",
        errors: zodErr,
      });
    }

    const existing = await prisma.discount.findUnique({ where: { id } });
    if (!existing || existing.id !== id) {
        throw new ErrorResponse("Discount not found", statusCode.Not_Found);
    }

    const discount = await prisma.discount.update({
        where: { id },
        data: req.body,
    });

    return SuccessResponse(reply, "Discount updated successfully", discount);
})