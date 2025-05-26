import { FastifyRequest } from "fastify";
import fs from "fs/promises";
import path from "path";
import { prisma } from "../../config";
import { asyncHandler } from "../utils/asyncHandler";
import { ErrorResponse, SuccessResponse } from "../utils/response.util";
import { statusCode } from "../types/types";
import { ProductValidator, ProductType} from "../validators";
import { zodError } from "../validators";

const productUploadDir = path.resolve(process.cwd(), "upload", "product");

export const listProduct = asyncHandler(async (req: FastifyRequest, reply) => {
  // Validate product data
  const validData = ProductValidator.safeParse(req.body);

  if (!validData.success) {
    return reply.status(400).send({
      success: false,
      message: "Validation failed",
      errors: zodError(validData.error),
    });
  }

  if (validData.data.sku) {
    const existingSku = await prisma.product.findUnique({
      where: { sku: validData.data.sku },
    });
    if (existingSku) {
      throw new ErrorResponse("SKU already exists", statusCode.Bad_Request);
    }
  }
  
  // Check if barcode already exists
  if (validData.data.barcode) {
    const existingBarcode = await prisma.product.findUnique({
      where: { barcode: validData.data.barcode },
    });
    if (existingBarcode) {
      throw new ErrorResponse("Barcode already exists", statusCode.Bad_Request);
    }
  }

  const data = validData.data;
  let imagePath: string | null = null;

  // Handle image if provided
  if (data.image) {
    const base64Regex = /^data:image\/([a-z]+);base64,/;
    const match = data.image.match(base64Regex);

    if (!match) {
      throw new ErrorResponse("Invalid base64 image format", statusCode.Bad_Request);
    }

    const extension = match[1];
    if (!["jpeg", "jpg", "png", "gif"].includes(extension)) {
      throw new ErrorResponse("Only JPEG, PNG, and GIF formats are supported", statusCode.Bad_Request);
    }

    const base64Data = data.image.replace(base64Regex, "");
    let imageBuffer: Buffer;
    try {
      imageBuffer = Buffer.from(base64Data, "base64");
    } catch (error) {
      throw new ErrorResponse("Failed to decode base64 image", statusCode.Bad_Request);
    }

    // Ensure upload directory exists
    try {
      await fs.mkdir(productUploadDir, { recursive: true });
    } catch (error) {
      throw new ErrorResponse("Failed to create upload directory", statusCode.Internal_Server_Error);
    }

    // Generate unique filename and save
    const fileName = `${Date.now()}-product.${extension}`;
    const filePath = path.join(productUploadDir, fileName);

    try {
      await fs.writeFile(filePath, imageBuffer);
      imagePath = `upload/product/${fileName}`;
    } catch (error) {
      throw new ErrorResponse("Failed to save image to server", statusCode.Internal_Server_Error);
    }
  }

 
    const createdProduct = await prisma.product.create({
      data: {
        ...data,
        image: imagePath,
      },
    });

    return SuccessResponse(reply, "Product created successfully", createdProduct);
});



export const getAllProducts = asyncHandler(
  async (
    req: FastifyRequest<{
      Querystring: {
        page?: string;
        limit?: string;
        isActive?: string;
        categoryId?: string;
        subCategoryId?: string;
        discountId?: string;
        searchQuery?: string;
      };
    }>,
    reply
  ) => {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const isActive =
      req.query.isActive === "true" || req.query.isActive === "false"
        ? req.query.isActive === "true"
        : undefined;

    const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
    const subCategoryId = req.query.subCategoryId ? Number(req.query.subCategoryId) : undefined;
    const discountId = req.query.discountId ? Number(req.query.discountId) : undefined;
    const searchQuery = req.query.searchQuery || "";

    // Build where clause
    const where: any = {};

    if (searchQuery) {
      where.OR = [
        { name: { contains: searchQuery } },
        { description: { contains: searchQuery } },
        { brand: { contains: searchQuery } },
      ];
    }

    if (isActive !== undefined) where.isActive = isActive;
    if (categoryId) where.categoryId = categoryId;
    if (subCategoryId) where.subCategoryId = subCategoryId;
    if (discountId) where.discountId = discountId;

    // Fetch data from DB
    const [products, totalProducts] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: true,
          subCategory: true,
          discount: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    return SuccessResponse(reply, "Products fetched successfully", {
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
      count: products.length,
    });
  }
);


export const getProductById = asyncHandler(
  async (
    req: FastifyRequest<{ Params: { id: string } }>,
    reply
  ) => {
    const id = Number(req.params.id);

    // Validate ID
    if (!id || isNaN(id)) {
      throw new ErrorResponse("Invalid product ID", statusCode.Bad_Request);
    }

    // Fetch product with related data
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        subCategory: true,
        discount: true,
      },
    });

    if (!product) {
      throw new ErrorResponse("Product not found", statusCode.Not_Found);
    }

    return SuccessResponse(reply, "Product fetched successfully", product);
  }
);

export const updateProduct = asyncHandler(
  async (
    req: FastifyRequest<{ Params: { id: string }; Body: Partial<ProductType> }>,
    reply
  ) => {
    const id = Number(req.params.id);
    if (!id || isNaN(id)) {
      throw new ErrorResponse("Invalid product ID", statusCode.Bad_Request);
    }

    const validData = ProductValidator.partial().safeParse(req.body);
    if (!validData.success) {
      const zodErr = zodError(validData.error);
      return reply.status(statusCode.Bad_Request).send({
        success: false,
        message: "Validation Error",
        errors: zodErr,
      });
    }

    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      throw new ErrorResponse("Product not found", statusCode.Not_Found);
    }

    // Handle image update
    let imagePath = existingProduct.image;
    if (validData.data.image) {
      const base64Prefix = /^data:image\/([a-z]+);base64,/;
      const match = validData.data.image.match(base64Prefix);
      if (!match) {
        throw new ErrorResponse("Invalid base64 image format", statusCode.Bad_Request);
      }

      const extension = match[1];
      if (!["jpeg", "jpg", "png", "gif"].includes(extension)) {
        throw new ErrorResponse(
          "Invalid image type. Only JPEG, PNG, and GIF are allowed.",
          statusCode.Bad_Request
        );
      }

      const base64Data = validData.data.image.replace(base64Prefix, "");
      let imageBuffer;
      try {
        imageBuffer = Buffer.from(base64Data, "base64");
      } catch (error) {
        throw new ErrorResponse("Invalid base64 data", statusCode.Bad_Request);
      }

      const fileName = `${Date.now()}-product.${extension}`;
      const filePath = path.join(productUploadDir, fileName);

      // Ensure directory exists
      await fs.mkdir(productUploadDir, { recursive: true });

      try {
        await fs.writeFile(filePath, imageBuffer);
        imagePath = `upload/product/${fileName}`;

        // Delete old image
        if (existingProduct.image) {
          const oldFilePath = path.resolve(process.cwd(), existingProduct.image);
          await fs.unlink(oldFilePath).catch((err) => {
            console.warn(`Failed to delete old image: ${oldFilePath}`, err);
          });
        }
      } catch (err) {
        throw new ErrorResponse("Failed to save image", statusCode.Internal_Server_Error);
      }
    }

    // Update the product in DB
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...validData.data,
        image: imagePath,
      },
    });

    return SuccessResponse(reply, "Product updated successfully", updatedProduct);
  }
);


export const getProductByBarCode = asyncHandler(async(req: FastifyRequest<{Params: {barcode: string}}>, reply) => {
  const {barcode} = req.params;

  if (!barcode || typeof barcode !== "string") {
    throw new ErrorResponse("Invalid or missing barcode", statusCode.Bad_Request);
  }

  const product = await prisma.product.findUnique({
    where: {
      barcode,
    },
    include: {
      category: true,
      subCategory: true,
      discount: true,
    },
  });

  if (!product) {
    throw new ErrorResponse("Product not found with given barcode", statusCode.Not_Found);
  }

  return SuccessResponse(reply, "Product fetched successfully", product);

})