"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeValidator = void 0;
const zod_1 = require("zod");
const genderEnum = zod_1.z.enum(["MALE", "FEMALE", "OTHER"]);
const salaryTypeEnum = zod_1.z.enum(["MONTHLY", "HOURLY"]);
const roleEnum = zod_1.z.enum(["SUPER_ADMIN", "ADMIN"]);
const employeeValidator = zod_1.z.object({
    prefix: zod_1.z.string({ required_error: "Prefix is required" }).trim().nonempty("Prefix is required"),
    firstName: zod_1.z.string({ required_error: "First name is required" }).trim().nonempty("First name is required"),
    lastName: zod_1.z.string({ required_error: "Last name is required" }).trim().nonempty("Last name is required"),
    email: zod_1.z.string({ required_error: "Email is required" })
        .trim()
        .nonempty("Email is required")
        .email("Invalid email format"),
    userName: zod_1.z.string({ required_error: "Username is required" }).trim().nonempty("Username is required"),
    password: zod_1.z.string({ required_error: "Password is required" })
        .trim(),
    accessStores: zod_1.z.array(zod_1.z.number(), { required_error: "Access store IDs are required" })
        .min(1, "At least one store ID is required"),
    dateOfBirth: zod_1.z.coerce.date({ required_error: "Date of birth is required" }),
    gender: genderEnum,
    bloodGroup: zod_1.z.string().trim().optional(),
    phone: zod_1.z.string({ required_error: "Phone number is required" }).trim().nonempty("Phone number is required"),
    alternatePhoneNumber: zod_1.z.string().trim().optional(),
    familyPhoneNumber: zod_1.z.string().trim().optional(),
    twitterLink: zod_1.z.string().trim().optional(),
    faceBookLink: zod_1.z.string().trim().optional(),
    instagramLink: zod_1.z.string().trim().optional(),
    guardian: zod_1.z.string().trim().optional(),
    aadharNumber: zod_1.z.string({ required_error: "Aadhar number is required" }).trim().nonempty("Aadhar number is required"),
    panNumber: zod_1.z.string({ required_error: "PAN number is required" }).trim().nonempty("PAN number is required"),
    permanentAddress: zod_1.z.string({ required_error: "Permanent address is required" }).trim().nonempty("Permanent address is required"),
    currentAddress: zod_1.z.string({ required_error: "Current address is required" }).trim().nonempty("Current address is required"),
    accountHolderName: zod_1.z.string({ required_error: "Account holder name is required" }).trim().nonempty("Account holder name is required"),
    accountNumber: zod_1.z.string({ required_error: "Account number is required" }).trim().nonempty("Account number is required"),
    bankName: zod_1.z.string({ required_error: "Bank name is required" }).trim().nonempty("Bank name is required"),
    IFSC_code: zod_1.z.string({ required_error: "IFSC code is required" }).trim().nonempty("IFSC code is required"),
    bankBranch: zod_1.z.string({ required_error: "Bank branch is required" }).trim().nonempty("Bank branch is required"),
    taxPayerId: zod_1.z.string().trim().optional(),
    primaryWorkLocation: zod_1.z.string().trim().optional(),
    basicSalary: zod_1.z.string({ required_error: "Basic salary is required" }).trim().nonempty("Basic salary is required"),
    salaryType: salaryTypeEnum,
    payComponent: zod_1.z.string().trim().optional(),
    hireDate: zod_1.z.coerce.date({ required_error: "Hire date is required" }),
    employeeRoleId: zod_1.z.number({ required_error: "Employee role ID is required" }),
});
exports.employeeValidator = employeeValidator;
