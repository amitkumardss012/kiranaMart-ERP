"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeValidator = void 0;
const zod_1 = require("zod");
const storeValidator = zod_1.z.object({
    name: zod_1.z
        .string({ required_error: "Store name is required" })
        .trim()
        .nonempty("Store name is required"),
    address: zod_1.z
        .string({ required_error: "Address is required" })
        .trim()
        .nonempty("Address is required"),
    city: zod_1.z
        .string({ required_error: "City is required" })
        .trim()
        .nonempty("City is required"),
    state: zod_1.z
        .string({ required_error: "State is required" })
        .trim()
        .nonempty("State is required"),
    country: zod_1.z
        .string({ required_error: "Country is required" })
        .trim()
        .nonempty("Country is required"),
    pincode: zod_1.z
        .string({ required_error: "Pincode is required" })
        .trim()
        .nonempty("Pincode is required"),
    contactNumber: zod_1.z
        .string({ required_error: "Contact number is required" })
        .trim()
        .nonempty("Contact number is required"),
    email: zod_1.z
        .string({ required_error: "Email is required" })
        .trim()
        .nonempty("Email is required"),
    type: zod_1.z
        .enum(["FRANCHISE", "COMPANY_OWNED", "OTHER"]),
    latitude: zod_1.z
        .number({ invalid_type_error: "Latitude must be a number" })
        .optional(),
    longitude: zod_1.z
        .number({ invalid_type_error: "Longitude must be a number" })
        .optional(),
});
exports.storeValidator = storeValidator;
