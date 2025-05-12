"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedPermissions = seedPermissions;
const config_1 = require("../../config");
function seedPermissions() {
    return __awaiter(this, void 0, void 0, function* () {
        yield config_1.prisma.permission.createMany({
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
    });
}
