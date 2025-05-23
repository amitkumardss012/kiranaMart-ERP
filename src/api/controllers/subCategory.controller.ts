import fs from "fs/promises";
import path from "path";
import { CategoryService } from "../services";
import { statusCode } from "../types/types";
import { asyncHandler } from "../utils/asyncHandler";
import { ErrorResponse, SuccessResponse } from "../utils/response.util";
import { zodError } from "../validators";
import { CategoryType, categoryValidator } from "../validators/categroy.validator";
import { FastifyRequest } from "fastify";
import { prisma } from "../../config";
import { SubCategoryValidator } from "../validators/subCategroy.validator";

// Upload directory for subcategory images
const subCategoryUploadDir = path.resolve(process.cwd(), "upload", "subcategory");

export const createSubCategory = asyncHandler(async (req: FastifyRequest, reply) => {
  const validData = SubCategoryValidator.safeParse(req.body);

  if (!validData.success) {
    return reply.status(400).send({
      success: false,
      message: "Validation failed",
      errors: zodError(validData.error),
    });
  }

  const data = validData.data;

  // Ensure upload directory exists
  try {
    await fs.mkdir(subCategoryUploadDir, { recursive: true });
  } catch (error) {
    throw new ErrorResponse("Failed to create upload directory", statusCode.Internal_Server_Error);
  }

  let imagePath: string | null = null;

  if (data.image) {
    const base64Prefix = /^data:image\/([a-z]+);base64,/;
    const match = data.image.match(base64Prefix);
    if (!match) {
      throw new ErrorResponse("Invalid base64 image format", statusCode.Bad_Request);
    }

    const extension = match[1];
    if (!["jpeg", "jpg", "png", "gif"].includes(extension)) {
      throw new ErrorResponse("Only JPEG, PNG, and GIF are allowed", statusCode.Bad_Request);
    }

    const base64Data = data.image.replace(base64Prefix, "");
    let imageBuffer: Buffer;
    try {
      imageBuffer = Buffer.from(base64Data, "base64");
    } catch (error) {
      throw new ErrorResponse("Invalid base64 data", statusCode.Bad_Request);
    }

    const fileName = `${Date.now()}-subcategory.${extension}`;
    const filePath = path.join(subCategoryUploadDir, fileName);

    try {
      await fs.writeFile(filePath, imageBuffer);
      imagePath = `upload/subcategory/${fileName}`;
    } catch (error) {
      throw new ErrorResponse("Failed to save image", statusCode.Internal_Server_Error);
    }
  }

  const subCategory = await prisma.subCategory.create({
    data: {
      name: data.name,
      description: data.description,
      image: imagePath ?? undefined,
      categoryId: data.categoryId,
      isActive: data.isActive ?? true,
    },
  });

  return SuccessResponse(reply, "SubCategory created successfully", subCategory);
});



export const getAllSubCategory = asyncHandler(
  async (
    req: FastifyRequest<{
      Querystring: {
        page: string;
        limit: string;
        isActive: string;
        searchQuery: string;
      };
    }>,
    reply
  ) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const isActive =
      req.query.isActive === "true" || req.query.isActive === "false"
        ? req.query.isActive === "true"
        : undefined;

    const searchQuery = req.query.searchQuery || "";

    const skip = (page - 1) * limit;

    const where: any = {};

    if (searchQuery) {
      where.name = {
        contains: searchQuery,
      };
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [subCategories, totalSubCategories] = await Promise.all([
      prisma.subCategory.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.subCategory.count({ where }),
    ]);

    return SuccessResponse(reply, "SubCategories fetched successfully", {
      subCategories,
      currentPage: page,
      totalPages: Math.ceil(totalSubCategories / limit),
      totalSubCategories,
      count: subCategories.length,
    });
  }
);


export const getSubCategoryById = asyncHandler(
  async (req: FastifyRequest<{ Params: { id: string } }>, reply) => {
    const id = Number(req.params.id);

    if (!id || isNaN(id)) {
      throw new ErrorResponse("Invalid id", statusCode.Bad_Request);
    }

    const subCategory = await prisma.subCategory.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!subCategory) {
      throw new ErrorResponse("SubCategory not found", statusCode.Not_Found);
    }

    return SuccessResponse(reply, "SubCategory fetched successfully", subCategory);
  }
);


export const updateSubCategory = asyncHandler(
  async (
    req: FastifyRequest<{ Params: { id: string }; Body: any }>,
    reply
  ) => {
    const id = Number(req.params.id);
    if (!id || isNaN(id)) {
      throw new ErrorResponse("Invalid id", statusCode.Bad_Request);
    }

    const validData = SubCategoryValidator.safeParse(req.body);
    if (!validData.success) {
      return reply.status(400).send({
        success: false,
        message: "Validation failed",
        errors: zodError(validData.error),
      });
    }

    const existing = await prisma.subCategory.findUnique({ where: { id } });
    if (!existing) {
      throw new ErrorResponse("SubCategory not found", statusCode.Not_Found);
    }

    // Ensure upload directory exists
    await fs.mkdir(subCategoryUploadDir, { recursive: true });

    // Image handling
    let imagePath = existing.image;
    if (validData.data.image && validData.data.image.startsWith("data:image/")) {
      const base64Prefix = /^data:image\/([a-z]+);base64,/;
      const match = validData.data.image.match(base64Prefix);
      if (!match) {
        throw new ErrorResponse("Invalid base64 image format", statusCode.Bad_Request);
      }

      const extension = match[1];
      if (!["jpeg", "jpg", "png", "gif"].includes(extension)) {
        throw new ErrorResponse("Unsupported image type", statusCode.Bad_Request);
      }

      const base64Data = validData.data.image.replace(base64Prefix, "");
      const buffer = Buffer.from(base64Data, "base64");

      const fileName = `${Date.now()}-subcategory.${extension}`;
      const filePath = path.join(subCategoryUploadDir, fileName);
      await fs.writeFile(filePath, buffer);
      imagePath = `upload/subcategory/${fileName}`;

      // Optional: Delete old image if needed
      if (existing.image && existing.image !== imagePath) {
        const oldImagePath = path.resolve(process.cwd(), existing.image);
        await fs.unlink(oldImagePath).catch(() => {});
      }
    }

    const updatedSubCategory = await prisma.subCategory.update({
      where: { id },
      data: {
        ...validData.data,
        image: imagePath,
      },
    });

    return SuccessResponse(reply, "SubCategory updated successfully", updatedSubCategory);
  }
);