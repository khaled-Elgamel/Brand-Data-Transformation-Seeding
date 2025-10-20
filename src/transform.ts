import mongoose from "mongoose";
import Brand, { IBrand } from "./brands-schema";
import connectDB from "./db";

/**
 * Transform and clean Brand documents in the database.
 * - Fix missing or inconsistent fields.
 * - Remove any fields not defined in the schema.
 * - Ensure data integrity before saving.
 */
async function transformBrands(): Promise<void> {
  // Connect to MongoDB
  await connectDB();

  // Fetch all brand documents from the collection
  const brands: IBrand[] = await Brand.find();

  //  Iterate through each brand document
  for (const brandDoc of brands) {
    // Convert Mongoose document to a plain JS object
    // (to access potential old or nested fields)
    const brandObj = brandDoc.toObject() as Partial<IBrand> & {
      brand?: { name?: string };
      hqAddress?: string;
      yearsFounded?: number;
      yearCreated?: number;
      [key: string]: any;
    };

    //  Transform brandName
    if (
      !brandDoc.brandName &&
      brandObj.brand?.name &&
      typeof brandObj.brand.name === "string"
    ) {
      brandDoc.brandName = brandObj.brand.name;
    }

    //  Transform headquarters
    if (
      !brandDoc.headquarters &&
      brandObj.hqAddress &&
      typeof brandObj.hqAddress === "string"
    ) {
      brandDoc.headquarters = brandObj.hqAddress;
    }

    //  Ensure numberOfLocations is a valid number
    brandDoc.numberOfLocations = brandDoc.numberOfLocations
      ? Number(brandDoc.numberOfLocations) || 1 // default value
      : 1;

    //  Fix yearFounded from possible alternative fields
    if (!brandDoc.yearFounded) {
      if (brandObj.yearsFounded) {
        brandDoc.yearFounded = Number(brandObj.yearsFounded) || 1960;
      } else if (brandObj.yearCreated) {
        brandDoc.yearFounded = Number(brandObj.yearCreated) || 1960;
      } else {
        brandDoc.yearFounded = 1960; // default year value
      }
    }

    // Define which fields to keep in the document
    const allowedFields = [
      "brandName",
      "yearFounded",
      "headquarters",
      "numberOfLocations",
      "_id",
      "createdAt",
      "updatedAt",
    ];

    // Get all keys currently in the document
    const docKeys = Object.keys(brandDoc.toObject());

    // Remove any extra/unwanted fields not in the schema
    for (const key of docKeys) {
      if (!allowedFields.includes(key)) {
        brandDoc.set(key, undefined, { strict: false }); // strict: false to allow for unknown/extra keys
      }
    }

    // Validate and save cleaned document
    await brandDoc.validate();
    await brandDoc.save();
  }

  await Brand.updateMany({}, { $unset: { brand: 1 } }, { strict: false });

  console.log(" All brand documents transformed successfully!");
}

// Run the transformation process
transformBrands().catch(console.error);
