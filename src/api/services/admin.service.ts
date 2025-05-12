import { prisma } from "../../config"
import { AdminType } from "../validators"

class AdminService{
    public static async createAdmin(data: AdminType){
        const admin = await prisma.admin.create({
            data
        })
        return admin
    }

    public static async getAdminByEmail(email: string){
        const admin = await prisma.admin.findUnique({
            where: {
                email
            }
        })
        return admin
    }

    public static async updateAdmin(id: number, data: Partial<AdminType>){
        const admin = await prisma.admin.update({
            where: {
                id,
            },
            data
        })
        return admin
    }

    public static async getAllAdmins(){
        const admins = await prisma.admin.findMany({
            select: {
                id: true,
                name: true,
                email: true,
            }
        })
        return admins
    }

    public static async getAdminById(id: number){
        const admin = await prisma.admin.findUnique({
            where: {
                id
            }
        }) 
        return admin
    }
}


export default AdminService