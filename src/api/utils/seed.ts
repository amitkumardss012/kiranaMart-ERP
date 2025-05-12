import { prisma } from "../../config";

async function seedPermissions() {
    await prisma.permission.createMany({
        data: [
            { name: "add_product" },
            { name: "list_product" },
            { name: "edit_product" },
            { name: "delete_product" },
            { name: "bill_product" }
        ],
        skipDuplicates: true,
    });
    console.log("Permissions seeded");
}

export {seedPermissions}