import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../config";
import { asyncHandler } from "../utils/asyncHandler";
import { companyPurchaseValidator } from "../validators/companyPurchase.validator";
import { zodError } from "../validators";
import { statusCode } from "../types/types";
import { ErrorResponse } from "../utils";
import { SuccessResponse } from "../utils/response.util";

export const createCompanyPurchase = asyncHandler(
  async (
    req: FastifyRequest<{ Body: any }>,
    reply: FastifyReply
  ) => {
    const body = req.body;

    // 1. Validate input
    const parsed = companyPurchaseValidator.safeParse(body);
    if (!parsed.success) {
      return reply.status(statusCode.Bad_Request).send({
        success: false,
        message: "Validation failed",
        errors: zodError(parsed.error),
      });
    }

        const data = parsed.data;
        
        // check if invoice number already exists
    const existingPurchase = await prisma.companyPurchase.findUnique({
      where: { invoiceNumber: data.invoiceNumber }, // Assuming invoiceNumber is unique
    });
    if (existingPurchase) throw new ErrorResponse(
      `Invoice number ${data.invoiceNumber} already exists.`,
      statusCode.Conflict
    );

    // 2. Check if store exists
    const store = await prisma.store.findUnique({
      where: { id: data.storeId },
    });

    if (!store) {
      throw new ErrorResponse(
        `Store with ID ${data.storeId} not found.`,
        statusCode.Not_Found
      );
    }

    // 3. Create company purchase
    const purchase = await prisma.companyPurchase.create({
      data: {
        invoiceNumber: data.invoiceNumber,
        supplierName: data.supplierName,
        purchaseDate: new Date(data.purchaseDate),
        receivedDate: data.receivedDate ? new Date(data.receivedDate) : null,
        productName: data.productName,
        quantity: data.quantity,
        unitPrice: data.unitPrice,
        taxAmount: data.taxAmount,
        discountAmount: data.discountAmount,
        paymentStatus: data.paymentStatus || "UNPAID",
        paymentMethod: data.paymentMethod || "CASH",
        remarks: data.remarks,
        storeId: data.storeId,
      },
    });

    return SuccessResponse(reply, "Company purchase created successfully", purchase);
  }
);



export const getAllCompanyPurchases = asyncHandler(
    async (req: FastifyRequest, reply: FastifyReply) => {
      const {
        page = 1,
        limit = 10,
        storeId,
        paymentStatus,
        paymentMethod,
        purchaseDateFrom,
          purchaseDateTo,
        searchQuery
      } = req.query as {
        page?: number;
        limit?: number;
        storeId?: number;
        paymentStatus?: "PAID" | "UNPAID";
        paymentMethod?: "CASH" | "CARD" | "UPI" | "OTHER";
        purchaseDateFrom?: string;
        purchaseDateTo?: string;
        searchQuery?: string;
      };
  
      const skip = (Number(page) - 1) * Number(limit);
      const take = Number(limit);
  
      const filters: any = {};
  
        if(searchQuery) {
        filters.OR = [
          { invoiceNumber: { contains: searchQuery } },
          { supplierName: { contains: searchQuery } },  
          { remarks: { contains: searchQuery } },
        ];
      }
      
  
      if (storeId) {
        filters.storeId = Number(storeId);
      }
  
      if (paymentStatus) {
        filters.paymentStatus = paymentStatus;
      }
  
      if (paymentMethod) {
        filters.paymentMethod = paymentMethod;
      }
  
      if (purchaseDateFrom || purchaseDateTo) {
        filters.purchaseDate = {};
        if (purchaseDateFrom) {
          filters.purchaseDate.gte = new Date(purchaseDateFrom);
        }
        if (purchaseDateTo) {
          filters.purchaseDate.lte = new Date(purchaseDateTo);
        }
      }
  
      const [purchases, total] = await Promise.all([
        prisma.companyPurchase.findMany({
          where: filters,
          skip,
          take,
          orderBy: {
            purchaseDate: "desc",
          },
          include: {
              store: {
                  select: {
                    id: true,
                    name: true,
                }
            },
          },
        }),
        prisma.companyPurchase.count({ where: filters }),
      ]);
  
      return SuccessResponse(reply, "Company purchases fetched successfully", {
          purchases,
          currentPage: Number(page),
          totalPages: Math.ceil(total / take),
          totalPurchases: total,
          count: purchases.length,
      });
    }
  );
  

  export const getCompanyPurchaseById = asyncHandler(
    async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const { id } = req.params;
  
      const purchase = await prisma.companyPurchase.findUnique({
        where: { id: Number(id) },
        include: {
          store: true,
        },
      });
  
      if (!purchase) {
        throw new ErrorResponse("Company purchase not found", statusCode.Not_Found);
      }
  
      return SuccessResponse(reply, "Company purchase fetched successfully", purchase);
    }
);
  

export const updateCompanyPurchaseById = asyncHandler(
    async (
      req: FastifyRequest<{ Params: { id: string }; Body: any }>,
      reply: FastifyReply
    ) => {
      const { id } = req.params;
      const parsed = companyPurchaseValidator.partial().safeParse(req.body);
  
      if (!parsed.success) {
        return reply.status(statusCode.Bad_Request).send({
          success: false,
          message: "Validation Error",
          errors: parsed.error.format(),
        });
      }
  
      const existing = await prisma.companyPurchase.findUnique({
        where: { id: Number(id) },
      });
  
      if (!existing) {
        throw new ErrorResponse("Company purchase not found", statusCode.Not_Found);
      }
  
      const updated = await prisma.companyPurchase.update({
        where: { id: Number(id) },
        data: parsed.data,
      });
  
      return SuccessResponse(reply, "Company purchase updated successfully", updated);
    }
  );

  export const deleteCompanyPurchaseById = asyncHandler(
    async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const { id } = req.params;
  
      const existing = await prisma.companyPurchase.findUnique({
        where: { id: Number(id) },
      });
  
      if (!existing) {
        throw new ErrorResponse("Company purchase not found", statusCode.Not_Found);
      }
  
      await prisma.companyPurchase.delete({
        where: { id: Number(id) },
      });
  
      return SuccessResponse(reply, "Company purchase deleted successfully", null);
    }
  );
  