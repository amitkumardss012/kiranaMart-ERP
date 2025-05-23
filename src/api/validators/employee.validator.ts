import { z } from "zod";

const genderEnum = z.enum(["MALE", "FEMALE", "OTHER"]);
const salaryTypeEnum = z.enum(["MONTHLY", "HOURLY"]);
const roleEnum = z.enum(["SUPER_ADMIN", "ADMIN"]);

const employeeValidator = z.object({
  prefix: z.string({ required_error: "Prefix is required" }).trim().nonempty("Prefix is required"),
  firstName: z.string({ required_error: "First name is required" }).trim().nonempty("First name is required"),
  lastName: z.string({ required_error: "Last name is required" }).trim().nonempty("Last name is required"),
  email: z.string({ required_error: "Email is required" })
    .trim()
    .nonempty("Email is required")
    .email("Invalid email format"),
  userName: z.string({ required_error: "Username is required" }).trim().nonempty("Username is required"),
  password: z.string({ required_error: "Password is required" })
    .trim(),
    accessStores: z.array(z.number(), { required_error: "Access store IDs are required" })
    .min(1, "At least one store ID is required"),
  dateOfBirth: z.coerce.date({ required_error: "Date of birth is required" }),
  gender: genderEnum,
  bloodGroup: z.string().trim().optional(),
  phone: z.string({ required_error: "Phone number is required" }).trim().nonempty("Phone number is required"),
  alternatePhoneNumber: z.string().trim().optional(),
  familyPhoneNumber: z.string().trim().optional(),
  twitterLink: z.string().trim().optional(),
  faceBookLink: z.string().trim().optional(),
  instagramLink: z.string().trim().optional(),
  guardian: z.string().trim().optional(),
  aadharNumber: z.string({ required_error: "Aadhar number is required" }).trim().nonempty("Aadhar number is required"),
  panNumber: z.string({ required_error: "PAN number is required" }).trim().nonempty("PAN number is required"),
  permanentAddress: z.string({ required_error: "Permanent address is required" }).trim().nonempty("Permanent address is required"),
  currentAddress: z.string({ required_error: "Current address is required" }).trim().nonempty("Current address is required"),
  accountHolderName: z.string({ required_error: "Account holder name is required" }).trim().nonempty("Account holder name is required"),
  accountNumber: z.string({ required_error: "Account number is required" }).trim().nonempty("Account number is required"),
  bankName: z.string({ required_error: "Bank name is required" }).trim().nonempty("Bank name is required"),
  IFSC_code: z.string({ required_error: "IFSC code is required" }).trim().nonempty("IFSC code is required"),
  bankBranch: z.string({ required_error: "Bank branch is required" }).trim().nonempty("Bank branch is required"),
  taxPayerId: z.string().trim().optional(),
  primaryWorkLocation: z.string().trim().optional(),
  basicSalary: z.string({ required_error: "Basic salary is required" }).trim().nonempty("Basic salary is required"),
  salaryType: salaryTypeEnum,
  payComponent: z.string().trim().optional(),
  hireDate: z.coerce.date({ required_error: "Hire date is required" }),
  employeeRoleId: z.number({ required_error: "Employee role ID is required" }),
});

type EmployeeType = z.infer<typeof employeeValidator>;

export { employeeValidator, EmployeeType };