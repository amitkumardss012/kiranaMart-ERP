import { FastifyRequest } from "fastify";
import { prisma } from "../../config";
import { asyncHandler } from "../utils/asyncHandler";
import { customerPurchaseValidator } from "../validators/customerPurchase.validator";
import { statusCode } from "../types/types";
import { zodError } from "../validators";
import { ErrorResponse } from "../utils";
import { SuccessResponse } from "../utils/response.util";

export const OrderProduct = asyncHandler(
  async (
    req: FastifyRequest<{ Body: { name: string; phone: string } }>,
    reply
  ) => {
    const body = req.body;

    const phone = body?.phone;
    if (!phone || typeof phone !== "string" || phone.trim().length < 5) {
      return reply.status(statusCode.Bad_Request).send({
        success: false,
        message: "Phone number is required and must be a valid string.",
      });
    }

    // Validate body using Zod (excluding phone from schema)
    const parsed = customerPurchaseValidator.safeParse(body);
    if (!parsed.success) {
      return reply.status(statusCode.Bad_Request).send({
        success: false,
        message: "Validation Error",
        errors: zodError(parsed.error),
      });
    }


    const data = parsed.data;

    let customer = await prisma.customer.findUnique({
      where: {
        phone: phone,
      },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: body.name || "",
          phone: body.phone || "",
        },
      });
    }

    // Step 3: Validate Products
    const productIds = data.purchaseItems.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    if (products.length !== productIds.length) {
      const existingIds = new Set(products.map((p) => p.id));
      const missing = productIds.filter((id) => !existingIds.has(id));
      throw new ErrorResponse(
        `Invalid or inactive product IDs: ${missing.join(", ")}`,
        statusCode.Bad_Request
      );
    }

    // Step 4: Validate Final Price Calculation
    for (const item of data.purchaseItems) {
      const calculated = item.unitPrice - (item.unitPrice * (item.discount ?? 0)) / 100;
      const expectedFinalPrice = parseFloat(calculated.toFixed(2));
      if (Math.abs(expectedFinalPrice - item.finalPrice) > 0.01) {
        throw new ErrorResponse(
          `Final price mismatch for productId ${item.productId}. Expected: ${expectedFinalPrice}, Received: ${item.finalPrice}`,
          400
        );
      }
    }

    // Step 5: Create Purchase
    const purchase = await prisma.customerPurchase.create({
        data: {
          customerId: customer.id,
          totalAmount: data.totalAmount,
          paymentMethod: data.paymentMethod,
          purchaseStatus: data.purchaseStatus ?? "COMPLETED",
          transactionId: data.transactionId,
          taxAmount: data.taxAmount,
          discountAmount: data.discountAmount,
          purchasedAt: new Date(),
      
          customerPurchaseItem: {
            create: data.purchaseItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              discount: item.discount,
              finalPrice: item.finalPrice,
            })),
          },
        },
        include: {
          customerPurchaseItem: true,
          customer: true,
        },
      });
      

    return SuccessResponse(
      reply,
      "Purchase created successfully",
      purchase
    )
  }
);