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

// Resolve upload directory relative to project root for reliability
const categoryUploadDir = path.resolve(process.cwd(), "upload", "category");

export const createCategory = asyncHandler(async (req, reply) => {
  // Validate request body with Zod
  const validData = categoryValidator.safeParse(req.body);
  if (!validData.success) {
    console.log("Validation error:", validData.error); // Debug validation
    return reply.status(400).send({
      success: false,
      message: "Validation failed",
      errors: zodError(validData.error),
    });
  }

  // Ensure upload directory exists
  try {
    await fs.mkdir(categoryUploadDir, { recursive: true });
    console.log(`Upload directory ensured: ${categoryUploadDir}`); // Debug path
  } catch (error) {
    console.error("Failed to create upload directory:", error);
    throw new ErrorResponse(
      "Failed to create upload directory",
      statusCode.Internal_Server_Error
    );
  }

  // Extract and process base64 image
  let imagePath = null;
  if (validData.data.image) {
    // Validate and extract base64 data
    const base64Prefix = /^data:image\/([a-z]+);base64,/;
    const match = validData.data.image.match(base64Prefix);
    if (!match) {
      throw new ErrorResponse(
        "Invalid base64 image format",
        statusCode.Bad_Request
      );
    }

    // Get image extension from MIME type
    const extension = match[1];
    if (!["jpeg", "jpg", "png", "gif"].includes(extension)) {
      throw new ErrorResponse(
        "Invalid image type. Only JPEG, PNG, and GIF are allowed.",
        statusCode.Bad_Request
      );
    }

    // Strip the data URL prefix and decode base64
    const base64Data = validData.data.image.replace(base64Prefix, "");
    let imageBuffer;
    try {
      imageBuffer = Buffer.from(base64Data, "base64");
      console.log(`Base64 decoded, buffer size: ${imageBuffer.length} bytes`); // Debug buffer
    } catch (error) {
      console.error("Base64 decoding error:", error);
      throw new ErrorResponse("Invalid base64 data", statusCode.Bad_Request);
    }

    // Generate unique filename
    const fileName = `${Date.now()}-image.${extension}`;
    const filePath = path.join(categoryUploadDir, fileName);

    // Save the image to the filesystem
    try {
      await fs.writeFile(filePath, imageBuffer);
      console.log(`Image saved to: ${filePath}`); // Debug file write
      imagePath = `upload/category/${fileName}`;
    } catch (error) {
      console.error("Failed to save image:", error);
      throw new ErrorResponse(
        "Failed to save image to filesystem",
        statusCode.Internal_Server_Error
      );
    }
  }
  const category = await CategoryService.createCategory(
    validData.data,
    imagePath as string
  );

  return SuccessResponse(reply, "Category created successfully", category);
});

export const getAllCategory = asyncHandler(
  async (
    req: FastifyRequest<{
      Querystring: { page: string; limit: string; isActive: string, searchQuery: string };
    }>,
    reply
  ) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const isActive =
      req.query.isActive === "true" || req.query.isActive === "false"
        ? req.query.isActive === "true"
        : undefined;
    const searchQuery = req.query.searchQuery || "";

    const where: any = {};
    if(searchQuery){
      where.name = {
        contains: searchQuery,
      };
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [categories, totalCategories] = await Promise.all([
      CategoryService.getAllCategories(page, limit, where),
      prisma.category.count(),
    ]);

 
    return SuccessResponse(reply, "Categories fetched successfully", {
      categories,
      currentPage: page,
      totalPages: Math.ceil(totalCategories / limit),
      totalCategories,
      count: categories.length,
    });
  }
);


export const getCategoryById = asyncHandler(
  async (req: FastifyRequest<{ Params: { id: string } }>, reply) => {
    const id = Number(req.params.id);
    if (!id || isNaN(id))
      throw new ErrorResponse("Invalid id", statusCode.Bad_Request); 

    const category = await CategoryService.getCategoryById(id);
    if (!category || category.id !== id)
      throw new ErrorResponse("Category not found", statusCode.Not_Found);

    return SuccessResponse(reply, "Category fetched successfully", category);
  } 
)

export const updateCategory = asyncHandler(async (req: FastifyRequest<{ Params: { id: string }; Body: Partial<CategoryType> }>, reply) => {
  const id = Number(req.params.id);
  if (!id || isNaN(id)) return new ErrorResponse("Invalid id", statusCode.Bad_Request);

  const validData = categoryValidator.partial().safeParse(req.body);
  if (!validData.success) {
    const zodErr = zodError(validData.error);
    return reply.status(statusCode.Bad_Request).send({
      success: false,
      message: "Validation Error",
      errors: zodErr,
    });
  }
  const existingCategory = await CategoryService.getCategoryById(id);
  if (!existingCategory) {
    throw new ErrorResponse("Category not found", statusCode.Not_Found);
  }

  let imagePath = existingCategory.image;
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
      console.log(`Base64 decoded, buffer size: ${imageBuffer.length} bytes`);
    } catch (error) {
      console.error("Base64 decoding error:", error);
      throw new ErrorResponse("Invalid base64 data", statusCode.Bad_Request);
    }

    const fileName = `${Date.now()}-image.${extension}`;
    const filePath = path.join(categoryUploadDir, fileName);

    try {
      await fs.writeFile(filePath, imageBuffer);
      console.log(`Image saved to: ${filePath}`);
      imagePath = `upload/category/${fileName}`;

      // Delete old image if it exists
      if (existingCategory.image) {
        const oldFilePath = path.join(process.cwd(), existingCategory.image);
        await fs.unlink(oldFilePath).catch((error) => {
          console.warn(`Failed to delete old image ${oldFilePath}:`, error);
        });
      }
    } catch (error) {
      console.error("Failed to save image:", error);
      throw new ErrorResponse("Failed to save image", statusCode.Internal_Server_Error);
    }
  }

  // Update category
  const category = await CategoryService.updateCategory(id, validData.data, imagePath as string);

  return SuccessResponse(reply, "Category updated successfully", category);
})