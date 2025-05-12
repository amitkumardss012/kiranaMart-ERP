import { prisma } from "../../config"
import { storeType } from "../validators/store.validator"

class StoreService {
    public static async create(data: storeType) {
        const store = await prisma.store.create({
            data
        })
        return store
    }

    public static async findByEmailorContact(email: string, contact: string) {
        const store = await prisma.store.findFirst({
            where: {
                OR: [
                    { email },
                    { contactNumber: contact }
                ]
            }
        })
        return store
    }

    public static async getAllStores() {
        const stores = await prisma.store.findMany({
            orderBy: {
                createdAt: "desc"
            }   
        })
        return stores
    }
}

export default StoreService