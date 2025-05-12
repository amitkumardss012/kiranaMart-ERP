import { z } from "zod";

const storeValidator = z.object({
  name: z
    .string({ required_error: "Store name is required" })
    .trim()
    .nonempty("Store name is required"),
  address: z
    .string({ required_error: "Address is required" })
    .trim()
    .nonempty("Address is required"),
  city: z
    .string({ required_error: "City is required" })
    .trim()
    .nonempty("City is required"),
  state: z
    .string({ required_error: "State is required" })
    .trim()
    .nonempty("State is required"),
  country: z
    .string({ required_error: "Country is required" })
    .trim()
    .nonempty("Country is required"),
  pincode: z
    .string({ required_error: "Pincode is required" })
    .trim()
    .nonempty("Pincode is required"),
  contactNumber: z
    .string({ required_error: "Contact number is required" })
    .trim()
    .nonempty("Contact number is required"),
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .nonempty("Email is required"),
  type: z
    .enum(["FRANCHISE", "COMPANY_OWNED", "OTHER"]),
  latitude: z
    .number({ invalid_type_error: "Latitude must be a number" })
    .optional(),
  longitude: z
    .number({ invalid_type_error: "Longitude must be a number" })
    .optional(),
});

type storeType = z.infer<typeof storeValidator>;

export { storeValidator, storeType };
