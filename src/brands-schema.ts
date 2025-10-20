import mongoose, { Schema, Document } from "mongoose";

export interface IBrand extends Document {
  brandName: string;
  yearFounded: number;
  headquarters: string;
  numberOfLocations: number;
}

const brandSchema: Schema = new Schema<IBrand>(
  {
    brandName: { type: String, required: true, trim: true },
    yearFounded: {
      type: Number,
      required: true,
      min: 1600,
      max: new Date().getFullYear(),
    },
    headquarters: { type: String, required: true, trim: true },
    numberOfLocations: { type: Number, required: true, min: 1 },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model<IBrand>("Brand", brandSchema);
