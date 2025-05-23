import { prisma } from "../../config";
import { CategoryType } from "../validators";

class CategoryService {
    public static async createCategory(data: CategoryType, imagePath: string) {
        const category = await prisma.category.create({
            data:{
                ...data,
               image: imagePath
            }
        })
        return category;
    }

    public static async getAllCategories(page: number, limit: number, where: any) {
        const categories = await prisma.category.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            include: {
                subCategory: true
            },
            orderBy: {
                createdAt: "desc" 
            }
        })    
        return categories;
    }

    public static async getCategoryById(id: number) {
        const category = await prisma.category.findUnique({
            where: {
                id
            },
            include: {
                subCategory: true
            }
        }) 

        return category;
    }

    public static async updateCategory(id: number, data: Partial<CategoryType>, imagePath: string) {
        const category = await prisma.category.update({
            where: {
                id
            },
            data: {
                ...data,
                image: imagePath
            } 
        })
        return category;
    }
}

export {CategoryService}