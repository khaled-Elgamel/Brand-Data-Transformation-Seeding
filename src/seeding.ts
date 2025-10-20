import { faker } from "@faker-js/faker";
import Brand, { type IBrand } from "./brands-schema";
import connectDB from "./db";

async function seedBrands(): Promise<void> {
  // Connect to the MongoDB database
  await connectDB();

  const newBrands: IBrand[] = [];

  // Generate 10 random brand documents using faker.js
  for (let i = 0; i < 10; i++) {
    // Generate random brand name
    const brandName: string = faker.commerce.productName();

    // Generate random headquarters
    const headquarters: string = faker.location.city();

    // Generate random founding year between 1600 and the current year
    const yearFounded: number = faker.number.int({
      min: 1600,
      max: new Date().getFullYear(),
    });

    // Generate random number of locations between 1 and 10,000
    const numberOfLocations: number = faker.number.int({
      min: 1,
      max: 10000,
    });

    // Push the generated object into the array, ensuring it matches IBrand
    newBrands.push({
      brandName,
      headquarters,
      yearFounded,
      numberOfLocations,
    } as IBrand);
  }

  // Insert all generated documents into MongoDB in a single batch
  await Brand.insertMany(newBrands);

  // Log a confirmation message after successful insertion
  console.log("10 new brand documents added to the database.");
}

seedBrands().catch(console.error);
